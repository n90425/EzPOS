package com.finalproject.possystem.pay.repository;

import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.pay.entity.Pay;
//import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.pay.entity.PaymentHistoryResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface PayRepository extends JpaRepository<Pay, byte[]> {

    // 결제 조회
    Pay findByPayNoAndPaySeqnum(byte[] payNo, int paySeqnum);

    // 특정 주문의 모든 결제 내역 조회
    Pay findByOrderNo(String orderNo);

    // 특정 상태 결제 조회
    List<Pay> findByPayStatCd(String payStatCd);

    // 특정 상태와 날짜 범위로 결제 조회
    @Query("SELECT p FROM Pay p WHERE p.payStatCd = :payStatCd AND p.payDt BETWEEN :startDate AND :endDate")
    List<Pay> findByPayStatCdAndPayDtBetween(String payStatCd, LocalDateTime startDate, LocalDateTime endDate);

    // 특정 주문번호의 미결제 상태 조회
    @Query("SELECT p FROM Pay p WHERE p.orderNo = :orderNo AND p.payStatCd = 'UNPAID'")
    List<Pay> findUnpaidByOrderNo(String orderNo);

    // 결제 취소 내역 조회
    @Query("SELECT p FROM Pay p WHERE p.payCancAmt IS NOT NULL AND p.payCancDt IS NOT NULL")
    List<Pay> findCancelledPayments();

    // 오늘의 총 매출액
    @Query("SELECT SUM(p.odPayAmt) FROM Pay p WHERE p.payStatCd = 'COMPLETED' AND p.payDt BETWEEN :startDate AND :endDate")
    Integer getTodayTotalSales(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // 오늘의 현금 매출액
    @Query("SELECT SUM(p.odPayAmt) FROM Pay p WHERE p.payStatCd = 'COMPLETED' AND p.payMethCd = 'CASH' AND p.payDt BETWEEN :startDate AND :endDate")
    Integer getTodayCashSales(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // 오늘의 카드 매출액
    @Query("SELECT SUM(p.odPayAmt) FROM Pay p WHERE p.payStatCd = 'COMPLETED' AND p.payMethCd = 'CARD' AND p.payDt BETWEEN :startDate AND :endDate")
    Integer getTodayCardSales(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // 오늘의 결제 건수
    @Query("SELECT COUNT(p.payNo) FROM Pay p WHERE p.payStatCd = 'COMPLETED' AND p.payDt BETWEEN :startDate AND :endDate")
    Integer getTodayReceiptCount(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // 결제 내역 조회
    @Query(value = "SELECT p.payDt AS paymentTime, " +
            "       o.storedTableNo AS tableNumber, " +
            "       p.payMethCd AS payMethCd, " +
            "       p.odPayAmt AS paymentAmount, " +
            "       p.cash_receipt_number AS receiptNumber " +
            "FROM pay p " +
            "JOIN `order` o ON p.orderNo = o.orderNo " +
            "WHERE (:startDate IS NULL OR p.payDt >= :startDate) " +
            "  AND (:endDate IS NULL OR p.payDt <= :endDate) " +
            "  AND (:posNumber IS NULL OR p.transType = :posNumber) " +
            "  AND (:payMethCd IS NULL OR p.payMethCd = :payMethCd) " +
            "  AND (:tableNumber IS NULL OR o.storedTableNo = :tableNumber) " +
            "  AND (:receiptNumber IS NULL OR p.cash_receipt_number = :receiptNumber)" +
            "ORDER BY p.payDt ASC",
            nativeQuery = true)
    List<PaymentHistoryResponse> findPaymentHistory(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("posNumber") String posNumber,
            @Param("payMethCd") String payMethCd,
            @Param("tableNumber") String tableNumber,
            @Param("receiptNumber") String receiptNumber);
}
