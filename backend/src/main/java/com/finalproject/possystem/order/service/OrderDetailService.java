package com.finalproject.possystem.order.service;

import com.finalproject.possystem.order.entity.OrderDetail;
import com.finalproject.possystem.order.repository.OrderDetailRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderDetailService {
    private OrderDetailRepository orderDetailRepo;

    @Transactional
    public void addItemToOrder(String orderNo, OrderDetail detail){
        /* orderAddNo의 최대값을 가져온다 */
        int maxOrdAddNo = orderDetailRepo.findMaxOrdAddByOrderNo(orderNo).orElse(0);
        /* ordAddNo 1씩 증가 */
        int newOrdAddNo = maxOrdAddNo+1;

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrderNo(orderNo); /* 주문번호 */
        orderDetail.setMenuId(detail.getMenuId()); /* 메뉴 */
        orderDetail.setOrdAddNo(newOrdAddNo); /* 추가주문번호 */
        orderDetail.setUnitPrice(detail.getUnitPrice()); /* 단가 */
        orderDetail.setQuantity(detail.getQuantity()); /* 수량 */
        orderDetail.calculateTotalAmount(); /* 수량 * 가격 */
        orderDetail.setItemOrderTime(detail.getItemOrderTime()); /* 주문시간 */
        orderDetailRepo.save(orderDetail);
    }
}
