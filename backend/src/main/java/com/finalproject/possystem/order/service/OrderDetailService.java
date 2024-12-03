package com.finalproject.possystem.order.service;

import com.finalproject.possystem.menu.entity.Menu;
import com.finalproject.possystem.menu.repository.MenuRepository;
import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.entity.OrderDetail;
import com.finalproject.possystem.order.repository.OrderDetailRepository;
import com.finalproject.possystem.order.repository.OrderRepository;
import com.finalproject.possystem.table.entity.Dining;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    /* 주문상세 삭제 */
    @Transactional
    public void deleteOrderDetail(Integer ordDetailNo, String orderNo, Integer tableNo) {
        // 특정 주문 상세를 삭제
        int deletedRows = orderDetailRepo.deleteOrderDetail(ordDetailNo, orderNo, tableNo);
        if (deletedRows == 0) {
            throw new IllegalArgumentException("삭제할 데이터가 없습니다.");
        }
        updateOrder(orderNo);
    }


    /* orderDetail orderAddNo 추가주문 값증가, 총금액계산 생성 */
    @Transactional
    public OrderDetail addItemToOrder(OrderDetail orderDetail){

        /* 해당주문에 동일한 메뉴ID가 있는지 확인 */
        OrderDetail existingOrderDetail = orderDetailRepo.findByOrderNoAndMenuId(
                orderDetail.getOrderNo(),
                orderDetail.getMenuId()
        );

        /* 동일한 메뉴가 있을경우 Quantity 수량 증가 */
        if(existingOrderDetail != null){
            /* 수량 1증가 */
            existingOrderDetail.setQuantity(existingOrderDetail.getQuantity()+1);
            /* 주문금액 수정 = 수량 * 금액 */
            existingOrderDetail.setTotalAmount(existingOrderDetail.getQuantity()* existingOrderDetail.getUnitPrice());
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

        /* 메뉴id로 단가 가져오기 */
        Integer unitPrice = menuRepo.findById(orderDetail.getMenuId())
                .map(Menu::getMenuPrice)
                .orElseThrow(()-> new IllegalArgumentException("유효하지않은 메뉴입니다"));
        orderDetail.setUnitPrice(unitPrice);

        /* 주문상세저장 */
        OrderDetail saveDetail = orderDetailRepo.save(orderDetail);
        /* Order 테이블 업데이트 */
        updateOrder(orderDetail.getOrderNo());
        return saveDetail;
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
            map.put("menuName", menuName);
            map.put("unitPrice", menuPrice);
            map.put("quantity", orderDetail.getQuantity());
            map.put("totalAmount", orderDetail.getTotalAmount());
            return map;
        }).collect(Collectors.toList());
    }


}
