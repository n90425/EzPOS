package com.finalproject.possystem.order.service;

import org.junit.jupiter.api.MethodOrderer;
import com.finalproject.possystem.order.entity.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OrderServiceTest {
    @Autowired
    private OrderService orderService;

    @Test
    void newOrder() {
//        Order order = new Order();
//        /* 주문번호생성 */
//        orderService.newOrder(order);
    }

    @Test
    void updateOrder() {
    }

    @Test
    void updateTable() {
    }

    @Test
    void delOrder() {
    }

    @Test
    void getOrder() {
    }

    @Test
    void readOrder() {
    }

    @Test
    void daysum() {
    }
}