package com.finalproject.possystem.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finalproject.possystem.menu.entity.Menu;
import com.finalproject.possystem.menu.repository.MenuRepository;
import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.entity.OrderDetail;
import com.finalproject.possystem.order.repository.OrderDetailRepository;
import com.finalproject.possystem.order.repository.OrderRepository;
import com.finalproject.possystem.table.entity.Dining;
import com.finalproject.possystem.websocket.KitchenWebSocketHandler;
import com.finalproject.possystem.websocket.dto.KitchenOrderDto;
import com.finalproject.possystem.websocket.dto.KitchenOrderItemDto;
import com.finalproject.possystem.websocket.dto.OrderDetailStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderDetailService {
    @Autowired
    private OrderDetailRepository orderDetailRepo;
    @Autowired
    private MenuRepository menuRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private KitchenWebSocketHandler kitchenWebSocketHandler;

    /* 주문상세 삭제 */
    @Transactional
    public void deleteOrderDetail(Integer ordDetailNo, String orderNo, Integer tableNo) {
        // 특정 주문 상세를 삭제
        int deletedRows = orderDetailRepo.deleteOrderDetail(ordDetailNo, orderNo, tableNo);
        System.out.println(deletedRows);
        if (deletedRows == 0) {
            throw new IllegalArgumentException("삭제할 데이터가 없습니다.");
        }
        updateOrder(orderNo);
    }

    @Transactional
    public void addItemsToOrder(String orderNo, List<OrderDetail> details){
        for (OrderDetail detail : details) {
            detail.setOrderNo(orderNo);
            addItemToOrder(detail);
        }

        /* 주문객체를 다시 조회 */
        Order updatedOrder = orderRepo.findByOrderNoWithDetails(orderNo)
                .orElseThrow(() -> new RuntimeException("주문조회실패"));
        /* 주방에 전송 */
        notifyKitchen(updatedOrder);
    }

    /* orderDetail orderAddNo 추가주문 값증가, 총금액계산 생성 */
    @Transactional
    public OrderDetail addItemToOrder(OrderDetail orderDetail){

        Order order = orderRepo.findById(orderDetail.getOrderNo())
                .orElseThrow(() -> new IllegalArgumentException("주문번호를 찾을 수 없습니다: " + orderDetail.getOrderNo()));

        order.setOrderNo(orderDetail.getOrderNo());
        /* 해당주문에 동일한 메뉴ID가 있는지 확인 */
        OrderDetail existingOrderDetail = orderDetailRepo.findByOrderNoAndMenuId(
                orderDetail.getOrderNo(),
                orderDetail.getMenuId()
        );


        /* 동일한 메뉴가 있을경우 Quantity 수량 수정 */
        if(existingOrderDetail != null){
            /* 수량업데이트 */
            existingOrderDetail.setQuantity(orderDetail.getQuantity());
            /* 주문금액 수정 = 수량 * 금액 */
            existingOrderDetail.setTotalAmount(existingOrderDetail.getQuantity()* existingOrderDetail.getUnitPrice());
            updateOrder(orderDetail.getOrderNo());
            return orderDetailRepo.save(existingOrderDetail);
        }

        /* orderAddNo의 최대값을 가져온다 */
        int maxOrdAddNo = orderDetailRepo.findMaxOrdAddByOrderNo(orderDetail.getOrderNo()).orElse(0);
        /* ordAddNo 1씩 증가 */
        orderDetail.setOrdAddNo(maxOrdAddNo+1);

        /* 수량이 null 이거나 0 이하일경우 기본값을 1로 준다 */
        if(orderDetail.getQuantity() == null || orderDetail.getQuantity() <= 0){
            orderDetail.setQuantity(1);
        }

        /* 메뉴가져오기 */
        Menu menu = menuRepo.findById(orderDetail.getMenuId())
                .orElseThrow(()-> new IllegalArgumentException("유효하지않은 메뉴입니다"));
        orderDetail.setUnitPrice(menu.getMenuPrice());
        orderDetail.setMenuName(menu.getMenuName());

        if(orderDetail.getStatus()==null){
            orderDetail.setStatus(OrderDetailStatus.NORMAL);
        }

        // Order 설정
        orderDetail.setOrder(order);

        /* 주문상세저장 */
        OrderDetail saveDetail = orderDetailRepo.save(orderDetail);
        /* Order 테이블 업데이트 */
        updateOrder(orderDetail.getOrderNo());


        return saveDetail;
    }

    /* 주문상세 수량변경 */
    @Transactional
    public OrderDetail updateQuantity(String orderNo, Integer orderDetailNo, int quantity) {
        OrderDetail existingOrderDetail = orderDetailRepo.findById(orderDetailNo)
                .orElseThrow(() -> new IllegalArgumentException("주문번호를 찾을수 없습니다: "+ orderNo)) ;

        existingOrderDetail.setQuantity(quantity);
        existingOrderDetail.setTotalAmount(quantity * existingOrderDetail.getUnitPrice());
        updateOrder(orderNo);

        System.out.println("existingOrderDetail======"+existingOrderDetail);
        return orderDetailRepo.save(existingOrderDetail);
    }

    /* 주문 업데이트 */
    public void updateOrder(String orderNo){
        Double totalAmount = orderDetailRepo.calTotalAmount(orderNo);

        if(totalAmount==null)
            totalAmount=0.0;
        Double netAmount = totalAmount/1.1;
        Double vat = totalAmount - netAmount;

        Order ord = orderRepo.findById(orderNo).orElseThrow(()-> new RuntimeException("주문을 찾을수 없습니다"));


        ord.setOrderAmount(netAmount);
        ord.setOrderVat(vat);
        orderRepo.save(ord);
    }

    public List<Map<String, Object>> getDetailWithMenuName(String orderNo){
        /* orderNo가 일치하는 menuID를 조회하고 menuname, 가격을 가져온다 */
        List<Object[]> result = orderDetailRepo.findMenuName(orderNo);

        return result.stream().map(row -> {
            OrderDetail orderDetail = (OrderDetail) row[0]; /* orderDetail 객체 */
            String menuName = (String) row[1]; /* menname 컬럼 */
            Integer menuPrice = (Integer) row[2]; /* menuPrice 컬럼 */

            Map<String, Object> map = new HashMap<>();

            map.put("ordDetailNo", orderDetail.getOrdDetailNo());
            map.put("menuId", orderDetail.getMenuId());
            map.put("menuName", menuName);
            map.put("unitPrice", menuPrice);
            map.put("quantity", orderDetail.getQuantity());
            map.put("totalAmount", orderDetail.getTotalAmount());
            return map;
        }).collect(Collectors.toList());
    }

    /* 주문을받아 주방으로 websocket 전송 */
    public void notifyKitchen(Order order){
        /* order 객체의 주문상세안의 메뉴명, 수량, 상태를 리스트로 변환 */
        List<KitchenOrderItemDto> items = order.getOrderDetails().stream()
                .map(d -> new KitchenOrderItemDto(d.getMenuName(), d.getQuantity(), d.getStatus()))
                .toList();

        /* 위 만든 데이터를 가지고 주방으로 보낼 DTO 객체를 생성 */
        KitchenOrderDto dto = new KitchenOrderDto(order.getOrderNo(), order.getTableNo(), items);
        try {
            /* DTO -> JSON 문자열로 직렬화 */
            /* websocket 메시지는 문자열이여야하니까 직렬화가 필요 */
            String json = new ObjectMapper().writeValueAsString(dto);
            System.out.println("WebSocket 전송 JSON: " + json);
            /* websocket 세션에 JSON 메시지 전송 */
            kitchenWebSocketHandler.sendMessageToAll(json);
        } catch(IOException e){
            throw new RuntimeException("주방알림전송실패", e);
        }
    }


}
