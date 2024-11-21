package com.finalproject.possystem.order.repository;

import com.finalproject.possystem.order.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    /* OrderDetail에 orderNo와 일치하는 orderAddNo 최대값을 가져오는데 null일경우 0을가져옴*/
    @Query("SELECT COALESCE(MAX(d.ordAddNo),0) FROM OrderDetail d WHERE d.orderNo=:orderNo")
    Optional<Integer> findMaxOrdAddByOrderNo(@Param("orderNo") String orderNo);
}
