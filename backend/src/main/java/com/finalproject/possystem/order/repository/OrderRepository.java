package com.finalproject.possystem.order.repository;


import com.finalproject.possystem.order.entity.Order;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    /* orderNo로 주문조회 */
    Order findByOrderNo(String orderNo);


    /* orderPayStatus 수정 */

    /* 선택주문 삭제 */
    int deleteByOrderNo(String orderNo);





}
