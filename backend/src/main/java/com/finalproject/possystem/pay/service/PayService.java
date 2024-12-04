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

    /**
     * 주문 데이터를 기반으로 Pay 테이블에 삽입 (현금 영수증 없음)
     */
    @Transactional
    public void processCashPayment(String orderNo) {
        System.out.println("Processing cash payment for orderNo: " + orderNo); // 로그 추가

        // Order 테이블에서 주문 데이터 조회
        Order order = orderRepository.findByOrderNo(orderNo);
        if (order == null) {
            throw new IllegalArgumentException("주문번호에 해당하는 주문을 찾을 수 없습니다.");
        }

        // 소수점 버리기 (정수로 변환)
        int amount = (int) Math.floor(order.getOrderAmount());

        System.out.println("Order found: " + order); // 로그 추가

        // Pay 엔티티 생성 및 저장
        Pay pay = new Pay();
        pay.setPayNo(uuidToBytes(UUID.randomUUID())); // UUID 생성 후 변환
        pay.setPaySeqnum(1); // 일련번호
        pay.setOrderNo(order.getOrderNo());
        pay.setOdPayAmt(amount); // 주문 총 금액
        pay.setPayMethCd("CASH"); // 결제 수단
        pay.setPayStatCd("COMPLETED"); // 결제 상태
        pay.setPayDt(LocalDateTime.now()); // 결제 일시

        System.out.println("Saving Pay entity: " + pay); // 로그 추가

        payRepository.save(pay);
        System.out.println("Payment successfully saved for orderNo: " + orderNo);
    }


    /**
     * 주문 데이터를 기반으로 Pay 테이블에 삽입 및 현금 영수증 발급
     */
    @Transactional
    public String processCashReceipt(String orderNo, String receiptNumber, String receiptType) {
        // Order 테이블에서 주문 데이터 조회
        Order order = orderRepository.findByOrderNo(orderNo);
        if (order == null) {
            throw new IllegalArgumentException("주문번호에 해당하는 주문을 찾을 수 없습니다.");
        }

        // 소수점 버리기 (정수로 변환)
        int amount = (int) Math.floor(order.getOrderAmount());

        // Pay 엔티티 생성 및 저장
        Pay pay = new Pay();
        pay.setPayNo(uuidToBytes(UUID.randomUUID())); // UUID 생성 후 변환
        pay.setPaySeqnum(1); // 일련번호 로직 필요 시 추가
        pay.setOrderNo(order.getOrderNo());
        pay.setOdPayAmt(amount); // 주문 총 금액
        pay.setPayMethCd("CASH"); // 결제 수단
        pay.setPayStatCd("COMPLETED"); // 결제 상태
        pay.setPayDt(LocalDateTime.now()); // 결제 일시
        pay.setCashReceiptNumber(receiptNumber);
        pay.setCashReceiptType(Pay.CashReceiptType.valueOf(receiptType));
        pay.setCashReceiptStatus(Pay.CashReceiptStatus.APPLIED);

        payRepository.save(pay);

        // 가짜 영수증 ID 생성
        return UUID.randomUUID().toString();
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
