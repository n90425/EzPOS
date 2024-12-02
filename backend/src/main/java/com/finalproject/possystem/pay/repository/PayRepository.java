package com.finalproject.possystem.pay.repository;

import com.finalproject.possystem.pay.entity.Pay;
import com.finalproject.possystem.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PayRepository extends JpaRepository<Pay, byte[]> {

    /* payNo와 paySeqnum으로 결제 조회 */
    Pay findByPayNoAndPaySeqnum(byte[] payNo, int paySeqnum);

    /* 특정 주문의 모든 결제 내역 조회 */
    List<Pay> findByOrderNo(String orderNo);

    /* 결제 상태(payStatCd)가 특정 값인 데이터 조회 */
    List<Pay> findByPayStatCd(String payStatCd);

    /* 특정 결제 상태와 날짜 범위로 조회 */
    @Query("SELECT p FROM Pay p WHERE p.payStatCd = :payStatCd AND p.payDt BETWEEN :startDate AND :endDate")
    List<Pay> findByPayStatCdAndPayDtBetween(String payStatCd, LocalDateTime startDate, LocalDateTime endDate);

    /* 특정 주문번호에 해당하는 미결제 상태 조회 */
    @Query("SELECT p FROM Pay p WHERE p.orderNo = :orderNo AND p.payStatCd = 'UNPAID'")
    List<Pay> findUnpaidByOrderNo(String orderNo);

    /* 특정 결제 취소 내역 조회 */
    @Query("SELECT p FROM Pay p WHERE p.payCancAmt IS NOT NULL AND p.payCancDt IS NOT NULL")
    List<Pay> findCancelledPayments();
}
