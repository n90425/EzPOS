package com.finalproject.possystem.order.repository;

import com.finalproject.possystem.order.entity.OrderSequence;
import com.finalproject.possystem.order.entity.QOrderSequence;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderSequenceRepository extends JpaRepository<OrderSequence, Date> {
    @Query("SELECT o.totalOrders, o.totalSales FROM OrderSequence o WHERE DATE(o.openDate) = :orderDate")
    List<Integer> findCountAndSumByOrderDate(@Param("orderDate") Date orderDate);

    OrderSequence findByIsOpenTrue();

    @Query("SELECT o from OrderSequence o where o.openDate = :targetDate")
    Optional<OrderSequence> findByOpenDate(LocalDateTime targetDate);

    @Query("SELECT o FROM OrderSequence o WHERE o.openDate BETWEEN :startDate AND :endDate")
    List<OrderSequence> findByOpenDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    
    
    @Query("SELECT o FROM OrderSequence o WHERE o.openDate BETWEEN :startDate AND :endDate")
    List<OrderSequence> findOrderSequencesInWeek(LocalDateTime startDate, LocalDateTime endDate);


}
