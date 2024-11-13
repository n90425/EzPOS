package com.finalproject.possystem.order.repository;

import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.table.entity.Dining;
import com.finalproject.possystem.table.repository.DiningRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import static java.time.LocalDateTime.now;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OrderRepositoryTest {
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private DiningRepository diningRepo;


    String datePart = now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    @Transactional
    @Rollback(false)
    public void testDate(){
        int numOrders = 10;

        for(int i=0; i<numOrders; i++){
            String orderNo = datePart + "-" + String.format("%06d", i);
            Dining dining = new Dining();
            dining.setTableNo(i);
            dining.setxPosition(BigDecimal.valueOf(100.00));
            dining.setyPosition(BigDecimal.valueOf(100.00));
            dining.setWidth(BigDecimal.valueOf(100.00));
            dining.setHeight(BigDecimal.valueOf(120.00));
            dining.setTableColor("Green"+i);
            diningRepo.save(dining);

            LocalDateTime orderTime = now();
            String orderPayStatus = (i%2==0)? "pending" : "completed";
            double orderAmount = (100.00 + (i*10.00));
            double orderVat = orderAmount*0.1;

            Order order = new Order(orderNo,dining,orderTime,orderPayStatus,orderAmount,orderVat);
            orderRepo.save(order);

            System.out.println(order);
        }
    }

    @Test
    public void countTest(){
        /* 전부삭제후 count */
        orderRepo.deleteAll();
        assertTrue(orderRepo.count()==0);

        /* 데이터 10개 insert후 count */
        testDate();
        assertTrue(orderRepo.count()==10);
    }

    @Test
    @Transactional
    public void insertTest(){
        /* 전부삭제후 count */
        orderRepo.deleteAll();
        assertTrue(orderRepo.count()==0);

        Dining dining = new Dining(12, new BigDecimal("200.00"), new BigDecimal("300.0"), "Red", new BigDecimal("100.00"), new BigDecimal("100.00"));

        diningRepo.save(dining); // Dining 객체를 먼저 저장

        Dining dining2 = new Dining(13,new BigDecimal("200.00"),new BigDecimal("300.0"),"Red", new BigDecimal("100.00"),new BigDecimal("100.00"));
        diningRepo.save(dining2); // Dining 객체를 먼저 저장



        /* 1번주문 추가 */
        Order order = new Order(datePart+"-000001", dining, now(), "pending", 10000.00, 1000.00);
        orderRepo.save(order);

        /* 2번주문 추가 */
        Order order2 = new Order(datePart+"-000002", dining2, now(), "pending", 10000.00, 1000.00);
        orderRepo.save(order2);

        /* 총주문은 2개 1번주문과 2번주문이 같은지 비교 */
        assertTrue(orderRepo.count()==2);
        assertTrue(!order.equals(order2));

        /* order 2번주문 삭제후 남은 주문의 count는 1 */
        assertTrue(orderRepo.deleteByOrderNo(order2.getOrderNo())==1);
        assertTrue(orderRepo.count()==1);

        orderRepo.deleteAll();
        assertTrue(orderRepo.count()==0);

        /* 데이터 10개 insert후 count */
        testDate();
        assertTrue(orderRepo.count()==10);
    }

    @Test
    @Transactional
    public void readTest(){
        /* 전부 삭제후 count */
        orderRepo.deleteAll();
        assertTrue(orderRepo.count()==0);

        Dining dining = new Dining(12, new BigDecimal("200.00"), new BigDecimal("300.0"), "Red", new BigDecimal("100.00"), new BigDecimal("100.00"));

        /* 데이터 10개 insert후 count */
        testDate();
        Order order = orderRepo.findByOrderNo(datePart+"-000000");
        assertTrue(orderRepo.count()==10);

        /* 0번고객을 select 후 order2에 저장, order와 order2가 동일한 주문인지 확인 */
        Order order2 = new Order(datePart+"-000000", dining, now(), "pending", 10000.00, 1000.00);
        assertTrue(order.getOrderNo().equals(order2.getOrderNo()));

        /* 0번 주문삭제 총 남은 주문은 9개 */
        assertTrue(orderRepo.deleteByOrderNo(order.getOrderNo())==1);
        assertTrue(orderRepo.count()==9);
    }

    @Test
    @Transactional
    public void deleteTest(){
        /* 전부 삭제후 count */
        orderRepo.deleteAll();
        assertTrue(orderRepo.count()==0);

        /* 데이터 10개 insert후 count */
        testDate();
        assertTrue(orderRepo.count()==10);

        /* 데이터 1개 지운후 count는 9 */
        assertTrue(orderRepo.deleteByOrderNo(datePart+"-000000")==1);
        assertTrue(orderRepo.count()==9);


        /* 지운데이터가 null인지 확인 */
        Optional<Order> order = orderRepo.findById(datePart+"-000000");
        assertTrue(!order.isPresent());
    }
}