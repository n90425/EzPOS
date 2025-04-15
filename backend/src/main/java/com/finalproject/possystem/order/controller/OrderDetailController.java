package com.finalproject.possystem.order.controller;


import com.finalproject.possystem.order.entity.OrderDetail;
import com.finalproject.possystem.order.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    /* 주문상세 수량변경 */
    @PostMapping("/order/{orderNo}/update")
    public ResponseEntity<?> updatedQuantity (
            @PathVariable String orderNo,
            @RequestParam Integer orderDetailNo,
            @RequestParam int quantity
    ) {
        OrderDetail updatedOrderDetail = orderDetailService.updateQuantity(orderNo, orderDetailNo, quantity);
        return ResponseEntity.ok(updatedOrderDetail);
    }

    /* 주문 상세 추가 단건 */
    @PostMapping("/order/{orderNo}/ordDetail")
    public ResponseEntity<OrderDetail> addOrderDetail(@PathVariable String orderNo, @RequestBody OrderDetail orderDetail){
        orderDetail.setOrderNo(orderNo);
        OrderDetail newDetail = orderDetailService.addItemToOrder(orderDetail);
        return ResponseEntity.ok(newDetail);
    }

    /* 주문 상세 추가 여러건 */
    @PostMapping("/order/{orderNo}/ordDetails")
    public ResponseEntity<?> addMultiOrderDetails(@PathVariable String orderNo, @RequestBody List<OrderDetail> orderDetails) {
        try {
            orderDetails.forEach(detail -> detail.setOrderNo(orderNo));
            orderDetailService.addItemsToOrder(orderNo, orderDetails);
            System.out.println("orderDetails===="+orderDetails);
            return ResponseEntity.ok("여러개의 주문상세가 성공적으로 추가되었습니다.");
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("에러: "+e.getMessage());
        }
    }

    /* 주문 상세 삭제 */
    @PostMapping("/order/delete/ordDetail")
    public ResponseEntity<Void> deleteOrderDetail(@RequestBody Map<String, Object> payload) {
        Integer ordDetailNo = (Integer) payload.get("ordDetailNo");
        String orderNo = (String) payload.get("orderNo");
        Integer tableNo = (Integer) payload.get("tableNo");

        System.out.println("삭제 요청 - ordDetailNo: " + ordDetailNo + ",  orderNo:" + orderNo+ ", tableNo: " + tableNo);
        orderDetailService.deleteOrderDetail(ordDetailNo, orderNo, tableNo);
        return ResponseEntity.noContent().build();
    }

    /* 주문 상세 조회 */
    /* orderNo가 일치하는 menuID를 조회하고 menuname, 가격을 가져온다 */
    @GetMapping("/order/{orderNo}/ordDetail")
    public ResponseEntity<List<Map<String, Object>>> getDetail(@PathVariable String orderNo){
        List<Map<String, Object>> orderDetails = orderDetailService.getDetailWithMenuName(orderNo);
        return ResponseEntity.ok(orderDetails);
    }

}
