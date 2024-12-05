package com.finalproject.possystem.pay.service;

import com.finalproject.possystem.pay.entity.Pay;
import com.finalproject.possystem.pay.repository.PayRepository;
import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    //현금영수증 없음
    @Transactional
    public void processCashPayment(String orderNo) {
        System.out.println("Processing cash payment for orderNo: " + orderNo);
        savePayment(orderNo, null, null);
        System.out.println("Payment successfully saved for orderNo: " + orderNo);
    }

    //현금영수증 있음
    @Transactional
    public String processCashReceipt(String orderNo, String receiptNumber, String receiptType) {
        System.out.println("OrderNo: " + orderNo);
        System.out.println("ReceiptNumber: " + receiptNumber);
        System.out.println("ReceiptType: " + receiptType);

        // 결제 저장
        savePayment(orderNo, receiptNumber, receiptType);

        // 가짜 영수증 ID 생성
        String receiptId = UUID.randomUUID().toString();
        System.out.println("Generated Receipt ID: " + receiptId);
        return receiptId;
    }

    //공통 pay 저장
    private void savePayment(String orderNo, String receiptNumber, String receiptType) {
        // Order 테이블에서 주문 데이터 조회
        Order order = orderRepository.findByOrderNo(orderNo);
        if (order == null) {
            throw new IllegalArgumentException("주문번호에 해당하는 주문을 찾을 수 없습니다.");
        }

        // 주문 총액 계산 (orderAmount + orderVat)
        double totalAmount = order.getOrderAmount() + order.getOrderVat();
        int roundedAmount = (int) Math.round(totalAmount); // 반올림 후 정수 처리

        System.out.println("Order found: " + order);
        System.out.println("Processed Total Amount (Rounded): " + roundedAmount);

        // Pay 엔티티 생성
        Pay pay = new Pay();
        pay.setPayNo(uuidToBytes(UUID.randomUUID())); // UUID 생성 후 변환
        pay.setPaySeqnum(1); // 일련번호
        pay.setOrderNo(order.getOrderNo());
        pay.setOdPayAmt(roundedAmount); // 주문 총 금액
        pay.setPayMethCd("CASH"); // 결제 수단
        pay.setPayStatCd("COMPLETED"); // 결제 상태
        pay.setPayDt(LocalDateTime.now()); // 결제 일시

        if (receiptNumber != null) {
            pay.setCashReceiptNumber(receiptNumber);
            pay.setCashReceiptType(Pay.CashReceiptType.valueOf(receiptType));
            pay.setCashReceiptStatus(Pay.CashReceiptStatus.APPLIED);
        } else {
            pay.setCashReceiptStatus(Pay.CashReceiptStatus.NOT_APPLIED);
        }

        System.out.println("Saving Pay entity: " + pay); // 로그 추가
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

}
