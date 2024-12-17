package com.finalproject.possystem.order.repository;

import com.finalproject.possystem.order.entity.OrderSequence;
import com.finalproject.possystem.order.entity.QOrderSequence;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderSequenceRepository extends JpaRepository<OrderSequence, Date>, OrderSequenceRepositoryCustom {
    @Query("SELECT COUNT(o), SUM(o.orderAmount) FROM Order o WHERE DATE(o.orderTime) = :orderDate")
    List<Integer> findCountAndSumByOrderDate(@Param("orderDate") Date orderDate);

    OrderSequence findByIsOpenTrue();

    Optional<OrderSequence> findByOpenDate(Date targetDate);
}
