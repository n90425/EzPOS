package com.finalproject.possystem.order.controller;


import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/order")
    public List<Order> getOrder(){
        System.out.println(orderService.allOrder());
        return orderService.allOrder();
    }

}
