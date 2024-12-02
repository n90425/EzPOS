package com.finalproject.possystem.order.repository;

import com.finalproject.possystem.order.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    /* OrderDetail에 orderNo와 일치하는 orderAddNo 최대값을 가져오는데 null일경우 0을가져옴*/
    @Query("SELECT COALESCE(MAX(d.ordAddNo),0) FROM OrderDetail d WHERE d.orderNo=:orderNo")
    Optional<Integer> findMaxOrdAddByOrderNo(@Param("orderNo") String orderNo);

    /* orderNo가 일치하는 menuID를 조인하고 OrderDetail객체 전체와 menuname을 가져온다 */
    @Query("SELECT d, m.menuName, m.menuPrice FROM OrderDetail d JOIN Menu m On d.menuId=m.menuId WHERE d.orderNo=:orderNo")
    List<Object[]> findMenuName(@Param("orderNo") String orderNo);

    @Modifying
    @Transactional
    @Query("DELETE FROM OrderDetail od WHERE od.ordDetailNo = :ordDetailNo AND od.orderNo =:orderNo AND od.order.dining.tableNo = :tableNo")
    int deleteOrderDetail(@Param("ordDetailNo") Integer ordDetailNo,
                          @Param("orderNo") String orderNo,
                          @Param("tableNo") Integer tableNo);
}
