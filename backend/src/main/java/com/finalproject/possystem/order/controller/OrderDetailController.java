package com.finalproject.possystem.order.controller;


import com.finalproject.possystem.order.entity.OrderDetail;
import com.finalproject.possystem.order.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderDetailController {
    @Autowired
    private OrderDetailService orderDetailService;

    /* 주문 상세 추가 */
    @PostMapping("/order/{orderNo}/ordDetail")
    public ResponseEntity<OrderDetail> addOrderDetail(@PathVariable String orderNo, @RequestBody OrderDetail orderDetail){
        orderDetail.setOrderNo(orderNo);
        OrderDetail newDetail = orderDetailService.addItemToOrder(orderDetail);
        return ResponseEntity.ok(newDetail);
    }

    /* 주문 상세 조회 */
    /* orderNo가 일치하는 menuID를 조회하고 menuname, 가격을 가져온다 */
    @GetMapping("/order/{orderNo}/ordDetail")
    public ResponseEntity<List<Map<String, Object>>> getDetail(@PathVariable String orderNo){
        List<Map<String, Object>> orderDetails = orderDetailService.getDetailWithMenuName(orderNo);
        return ResponseEntity.ok(orderDetails);
    }

}
