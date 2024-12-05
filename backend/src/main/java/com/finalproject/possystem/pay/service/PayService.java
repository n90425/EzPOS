package com.finalproject.possystem.pay.service;

import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.repository.OrderRepository;
import com.finalproject.possystem.pay.entity.Pay;
import com.finalproject.possystem.pay.repository.PayRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PayService {
    private final PayRepository payRepository;
    private final OrderRepository orderRepository;

    public PayService(PayRepository payRepository, OrderRepository orderRepository) {
        this.payRepository = payRepository;
        this.orderRepository = orderRepository;
    }

    //현금영수증 X
    @Transactional
    public void processCashPayment(String orderNo) {
        System.out.println("Processing cash payment for orderNo: " + orderNo);
        savePayment(orderNo, "CASH", null, null, null);
        System.out.println("Cash payment successfully saved for orderNo: " + orderNo);
    }

    //현금영수증 O
    @Transactional
    public String processCashReceipt(String orderNo, String receiptNumber, String receiptType) {
        System.out.println("Processing cash receipt for orderNo: " + orderNo);
        savePayment(orderNo, "CASH", null, receiptNumber, receiptType);
        return UUID.randomUUID().toString(); // 가짜 영수증 ID 생성
    }

    //카드결제
    @Transactional
    public void processCardPayment(String orderNo, String cardNumber, String expiryDate, String cvv) {
        System.out.println("Processing card payment for orderNo: " + orderNo);
        savePayment(orderNo, "CARD", cardNumber, null, null);
        System.out.println("Card payment successfully processed for orderNo: " + orderNo);
    }

    //공통 저장
    private void savePayment(String orderNo, String payMethCd, String cardNumber, String receiptNumber, String receiptType) {
        // Order 테이블에서 주문 데이터 조회
        Order order = orderRepository.findByOrderNo(orderNo);
        if (order == null) {
            throw new IllegalArgumentException("주문번호에 해당하는 주문을 찾을 수 없습니다.");
        }

        // 주문 총액 계산 (orderAmount + orderVat)
        double totalAmount = order.getOrderAmount() + order.getOrderVat();
        int roundedAmount = (int) Math.round(totalAmount);

        System.out.println("Order found: " + order);
        System.out.println("Processed Total Amount (Rounded): " + roundedAmount);

        // Pay 엔티티 생성
        Pay pay = new Pay();
        pay.setPayNo(uuidToBytes(UUID.randomUUID())); // UUID 생성 후 변환
        pay.setPaySeqnum(1); // 일련번호
        pay.setOrderNo(order.getOrderNo());
        pay.setOdPayAmt(roundedAmount);
        pay.setPayMethCd(payMethCd); // 결제 수단
        pay.setPayStatCd("COMPLETED");
        pay.setPayDt(LocalDateTime.now());

        if ("CARD".equals(payMethCd)) {
            // 카드 결제 관련 정보 설정
            pay.setCardNum(maskCardNumber(cardNumber)); // 카드번호 마스킹
            pay.setPayAprvNum(generateApprovalNumber()); // 승인번호 생성
        } else if ("CASH".equals(payMethCd) && receiptNumber != null) {
            // 현금 영수증 관련 정보 설정
            pay.setCashReceiptNumber(receiptNumber);
            pay.setCashReceiptType(Pay.CashReceiptType.valueOf(receiptType));
            pay.setCashReceiptStatus(Pay.CashReceiptStatus.APPLIED);
        } else {
            pay.setCashReceiptStatus(Pay.CashReceiptStatus.NOT_APPLIED);
        }

        System.out.println("Saving Pay entity: " + pay);
        payRepository.save(pay);
    }

    private byte[] uuidToBytes(UUID uuid) {
        byte[] bytes = new byte[16];
        long mostSignificantBits = uuid.getMostSignificantBits();
        long leastSignificantBits = uuid.getLeastSignificantBits();

        for (int i = 0; i < 8; i++) {
            bytes[i] = (byte) (mostSignificantBits >>> (8 * (7 - i)));
            bytes[8 + i] = (byte) (leastSignificantBits >>> (8 * (7 - i)));
        }
        return bytes;
    }

    private String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            throw new IllegalArgumentException("유효하지 않은 카드 번호입니다.");
        }
        return "*".repeat(cardNumber.length() - 4) + cardNumber.substring(cardNumber.length() - 4);
    }

    private String generateApprovalNumber() {
        int approvalNumber = (int) (Math.random() * 900000) + 100000; // 100000 ~ 999999 범위
        return String.valueOf(approvalNumber);
    }
}
