package com.finalproject.possystem.order.repository;


import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.table.entity.Dining;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    /* orderNo로 주문조회 */
    Order findByOrderNo(String orderNo);

    /* 주문번호 생성 */
    @Query("SELECT MAX(o.orderNo) from Order o WHERE o.orderNo LIKE :datePart")
    String findMaxOrderNo(@Param("datePart") String datePart);

    /* 기간조회 */
    List<Order> findAllByOrderTimeBetween(LocalDateTime startDate, LocalDateTime endDate);

    /* 기간 + 결제상태 (PAID, UNPAID) 조회 */
    List<Order> findAllByOrderTimeBetweenAndOrderPayStatus(LocalDateTime startDate, LocalDateTime endDate, String status);

    /* 특정날짜 이전조회: endDate만 지정한경우 (처음~end까지조회) */
    List<Order> findAllByOrderTimeBefore(LocalDateTime endDate);

    /* 특정날짜 이전조회 + 상태코드 (PAID, UNPAID) */
    List<Order> findAllByOrderTimeBeforeAndOrderPayStatus(LocalDateTime endDate, String status);

    /* 특정날짜 이후조회: startDate만 지정한경우 (start부터 ~ 끝까지조회) */
    List<Order> findAllByOrderTimeAfter(LocalDateTime startDate);

    /* 특정날짜 이후조회 + 상태코드 (PAID, UNPAID)조회 */
    List<Order> findAllByOrderTimeAfterAndOrderPayStatus(LocalDateTime startDate, String status);




    /* orderPayStatus 수정 */

    /* 선택주문 삭제 */
    int deleteByOrderNo(String orderNo);

    List<Order> findByDining(Dining dining);

    /* 선택된 테이블의 번호와 주문이 UNPAID 된 주문을 찾는다 */
    @Query(value = "SELECT * FROM `order` WHERE tableNo = :tableNo AND orderPayStatus='UNPAID' ORDER BY orderTime DESC LIMIT 1", nativeQuery = true)
    Optional<Order> findByTableNo(Integer tableNo);
}
