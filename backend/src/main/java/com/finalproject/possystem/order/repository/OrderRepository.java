package com.finalproject.possystem.order.repository;


import com.finalproject.possystem.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    /* SELECT * FROM ORDER WHERE ORDER_NO =: ORDER_NO */
    /* READ */
    Order findByOrderNo(String orderNo);

    /* DELETE */
    /* DELETE FROM ORDER WHERE ORDER_NO =: ORDER_NO */
    int deleteByOrderNo(String orderNo);

    /* INSERT */
    /* INSERT INTO FROM ORDER VALUES ()*/



    /* UPDATE */


    /*
    update 문은 @Query 어노테이션을 사용하여 쿼리문을 수동으로 작성
    UPDATE ORDER SET
    TABLE_NO =: TABLE_NO
    ORDER_TIME =: ORDER_TIME
    ORDER_PAY_STATUS =: ORDER_PAY_STATUS
    ORDER_AMOUNT =: ORDER_AMOUNT
    ORDER_VAT =: ORDER_VAT
    WHERE ORDER_NO =: ORDER_NO
    ORDER BY ORDER_TIME DESC
     */

}
