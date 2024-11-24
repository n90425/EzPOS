package com.finalproject.possystem.order.service;

import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.entity.OrderDetail;
import com.finalproject.possystem.order.repository.OrderDetailRepository;
import com.finalproject.possystem.order.repository.OrderRepository;
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
    private OrderRepository orderRepo;

    /* orderDetail orderAddNo 추가주문 값증가, 총금액계산 생성 */
    @Transactional
    public OrderDetail addItemToOrder(OrderDetail orderDetail){
        /* orderAddNo의 최대값을 가져온다 */
        int maxOrdAddNo = orderDetailRepo.findMaxOrdAddByOrderNo(orderDetail.getOrderNo()).orElse(0);
        /* ordAddNo 1씩 증가 */
        orderDetail.setOrdAddNo(maxOrdAddNo+1);

        /* 수량이 null 이거나 0 이하일경우 기본값을 1로 준다 */
        if(orderDetail.getQuantity() == null || orderDetail.getQuantity() <= 0){
            orderDetail.setQuantity(1);
        }
        /* 수량 * 가격 = 총금액을 계산 */
        orderDetail.calculateTotalAmount();
        return orderDetailRepo.save(orderDetail);
    }


    public List<Map<String, Object>> getDetailWithMenuName(String orderNo){
        /* orderNo가 일치하는 menuID를 조회하고 menuname, 가격을 가져온다 */
        List<Object[]> result = orderDetailRepo.findMenuName(orderNo);

        return result.stream().map(row -> {
            OrderDetail orderDetail = (OrderDetail) row[0]; /* orderDetail 객체 */
            String menuName = (String) row[1]; /* menname 컬럼 */
            Integer menuPrice = (Integer) row[2]; /* menuPrice 컬럼 */

            Map<String, Object> map = new HashMap<>();
            map.put("menuName", menuName);
            map.put("unitPrice", menuPrice);
            map.put("quantity", orderDetail.getQuantity());
            map.put("totalAmount", orderDetail.getTotalAmount());
            return map;
        }).collect(Collectors.toList());
    }


}
