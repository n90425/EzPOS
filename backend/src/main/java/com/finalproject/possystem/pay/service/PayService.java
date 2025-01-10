package com.finalproject.possystem.pay.service;

import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.repository.OrderRepository;
import com.finalproject.possystem.pay.entity.Pay;
import com.finalproject.possystem.pay.entity.PaymentHistoryResponse;
import com.finalproject.possystem.pay.repository.PayRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.finalproject.possystem.table.entity.Dining;
import com.finalproject.possystem.table.repository.DiningRepository;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

//@Service
//public class PayService {
//    private final PayRepository payRepository;
//    private final OrderRepository orderRepository;
//    private final DiningRepository diningRepository;
//
//    public PayService(PayRepository payRepository, OrderRepository orderRepository, DiningRepository diningRepository) {
//        this.payRepository = payRepository;
//        this.orderRepository = orderRepository;
//        this.diningRepository = diningRepository;
//    }
//
//    //현금영수증 X
//    @Transactional
//    public void processCashPayment(String orderNo) {
//        System.out.println("Processing cash payment for orderNo: " + orderNo);
//        savePayment(orderNo, "CASH", null, null, null);
//        System.out.println("Cash payment successfully saved for orderNo: " + orderNo);
//    }
//
//    //현금영수증 O
//    @Transactional
//    public String processCashReceipt(String orderNo, String receiptNumber, String receiptType) {
//        System.out.println("Processing cash receipt for orderNo: " + orderNo);
//        savePayment(orderNo, "CASH", null, receiptNumber, receiptType);
//        return UUID.randomUUID().toString(); // 가짜 영수증 ID 생성
//    }
//
//    //카드결제
//    @Transactional
//    public void processCardPayment(String orderNo, String cardNumber, String expiryDate, String cvv) {
//        System.out.println("Processing card payment for orderNo: " + orderNo);
//        savePayment(orderNo, "CARD", cardNumber, null, null);
//        System.out.println("Card payment successfully processed for orderNo: " + orderNo);
//    }
//
//    //공통 저장
//    private void savePayment(String orderNo, String payMethCd, String cardNumber, String receiptNumber, String receiptType) {
//        // Order 테이블에서 주문 데이터 조회
//        Order order = orderRepository.findByOrderNo(orderNo);
//        if (order == null) {
//            throw new IllegalArgumentException("주문번호에 해당하는 주문을 찾을 수 없습니다.");
//        }
//
//        // 주문 총액 계산 (orderAmount + orderVat)
//        double totalAmount = order.getOrderAmount() + order.getOrderVat();
//        int roundedAmount = (int) Math.round(totalAmount);
//
//        System.out.println("Order found: " + order);
//        System.out.println("Processed Total Amount (Rounded): " + roundedAmount);
//
//        // Pay 엔티티 생성
//        Pay pay = new Pay();
//        pay.setPayNo(uuidToBytes(UUID.randomUUID())); // UUID 생성 후 변환
//        pay.setPaySeqnum(1); // 일련번호
//        pay.setOrderNo(order.getOrderNo());
//        pay.setOdPayAmt(roundedAmount);
//        pay.setPayMethCd(payMethCd); // 결제 수단
//        pay.setPayStatCd("COMPLETED");
//        pay.setPayDt(LocalDateTime.now());
//
//        if ("CARD".equals(payMethCd)) {
//            // 카드 결제 관련 정보 설정
//            pay.setCardNum(maskCardNumber(cardNumber)); // 카드번호 마스킹
//            pay.setPayAprvNum(generateApprovalNumber()); // 승인번호 생성
//        } else if ("CASH".equals(payMethCd) && receiptNumber != null) {
//            // 현금 영수증 관련 정보 설정
//            pay.setCashReceiptNumber(receiptNumber);
//            pay.setCashReceiptType(Pay.CashReceiptType.valueOf(receiptType));
//            pay.setCashReceiptStatus(Pay.CashReceiptStatus.APPLIED);
//        } else {
//            pay.setCashReceiptStatus(Pay.CashReceiptStatus.NOT_APPLIED);
//        }
//
//        System.out.println("Saving Pay entity: " + pay);
//        payRepository.save(pay);
//    }
//
//    private byte[] uuidToBytes(UUID uuid) {
//        byte[] bytes = new byte[16];
//        long mostSignificantBits = uuid.getMostSignificantBits();
//        long leastSignificantBits = uuid.getLeastSignificantBits();
//
//        for (int i = 0; i < 8; i++) {
//            bytes[i] = (byte) (mostSignificantBits >>> (8 * (7 - i)));
//            bytes[8 + i] = (byte) (leastSignificantBits >>> (8 * (7 - i)));
//        }
//        return bytes;
//    }
//
//    private String maskCardNumber(String cardNumber) {
//        if (cardNumber == null || cardNumber.length() < 4) {
//            throw new IllegalArgumentException("유효하지 않은 카드 번호입니다.");
//        }
//        return "*".repeat(cardNumber.length() - 4) + cardNumber.substring(cardNumber.length() - 4);
//    }
//
//    private String generateApprovalNumber() {
//        int approvalNumber = (int) (Math.random() * 900000) + 100000; // 100000 ~ 999999 범위
//        return String.valueOf(approvalNumber);
//    }
//    @Transactional
//    public void orderPayComplete(String orderNo){
//        Order order = orderRepository.findByOrderNo(orderNo);
//
//        if(order==null){
//            throw new IllegalArgumentException("주문번호를 찾을수 없습니다");
//        }
//
//        order.setOrderPayStatus("PAID");
//
//        Dining dining = order.getDining();
//        if(dining != null){
//            dining.freeTable();
//            diningRepository.save(dining);
//        }
//        order.disconnectTable();
//        orderRepository.save(order);
//    }
//
//    //결제내역
//    @Transactional(readOnly = true)
//    public List<PaymentHistoryResponse> getPaymentHistory(
//            String startDate,
//            String endDate,
//            String posNumber,
//            String payMethCd,
//            String tableNumber,
//            String receiptNumber) {
//        return payRepository.findPaymentHistory(startDate, endDate, posNumber, payMethCd, tableNumber, receiptNumber);
//    }
//
//
//    // main페이지에 매출요약 가져오기
//    public Map<String, Object> getTodaySalesSummary() {
//        Integer totalSales = payRepository.getTodayTotalSales();
//        Integer cashSales = payRepository.getTodayCashSales();
//        Integer cardSales = payRepository.getTodayCardSales();
//        Integer receiptCount = payRepository.getTodayReceiptCount();
//
//        // 부가세 계산 (예: 10%)
//        Integer vatAmount = (totalSales != null) ? (int) (totalSales /1.1) : 0;
//        Integer netSales = (totalSales != null) ? totalSales - vatAmount : 0;
//
//        // Null 값 방지
//        totalSales = totalSales == null ? 0 : totalSales;
//        cashSales = cashSales == null ? 0 : cashSales;
//        cardSales = cardSales == null ? 0 : cardSales;
//        receiptCount = receiptCount == null ? 0 : receiptCount;
//
//        Map<String, Object> summary = new HashMap<>();
//        summary.put("totalSales", totalSales);
//        summary.put("cashSales", cashSales);
//        summary.put("cardSales", cardSales);
//        summary.put("receiptCount", receiptCount);
//        summary.put("vatAmount", vatAmount);
//        summary.put("netSales", netSales);
//
//        return summary;
//    }
//
//
//}





@Service
public class PayService {
    private final PayRepository payRepository;
    private final OrderRepository orderRepository;
    private final DiningRepository diningRepository;

    public PayService(PayRepository payRepository, OrderRepository orderRepository, DiningRepository diningRepository) {
        this.payRepository = payRepository;
        this.orderRepository = orderRepository;
        this.diningRepository = diningRepository;
    }

    // 현금 결제 처리 (영수증 없음)
    @Transactional
    public void processCashPayment(String orderNo) {
        savePayment(orderNo, "CASH", null, null, null);
    }

    // 현금 영수증 처리
    @Transactional
    public String processCashReceipt(String orderNo, String receiptNumber, String receiptType) {
        savePayment(orderNo, "CASH", null, receiptNumber, receiptType);
        return UUID.randomUUID().toString(); // 임의의 영수증 ID 생성
    }

    // 카드 결제 처리
    @Transactional
    public void processCardPayment(String orderNo, String cardNumber, String expiryDate, String cvv) {
        savePayment(orderNo, "CARD", cardNumber, null, null);
    }

    // 공통 결제 저장 로직
    private void savePayment(String orderNo, String payMethCd, String cardNumber, String receiptNumber, String receiptType) {
        // 주문 데이터 조회
        Order order = orderRepository.findByOrderNo(orderNo);
        if (order == null) {
            throw new IllegalArgumentException("주문번호에 해당하는 주문을 찾을 수 없습니다.");
        }

        // 총 결제 금액 계산
        double totalAmount = order.getOrderAmount() + order.getOrderVat();
        int roundedAmount = (int) Math.round(totalAmount);

        // Pay 엔티티 생성 및 설정
        Pay pay = new Pay();
        pay.setPayNo(uuidToBytes(UUID.randomUUID())); // UUID 변환
        pay.setPaySeqnum(1); // 일련번호
        pay.setOrderNo(order.getOrderNo());
        pay.setOdPayAmt(roundedAmount);
        pay.setPayMethCd(payMethCd); // 결제 방식
        pay.setPayStatCd("COMPLETED");
        pay.setPayDt(LocalDateTime.now());

        if ("CARD".equals(payMethCd)) {
            pay.setCardNum(maskCardNumber(cardNumber)); // 카드번호 마스킹
            pay.setPayAprvNum(generateApprovalNumber()); // 승인번호 생성
        } else if ("CASH".equals(payMethCd) && receiptNumber != null) {
            pay.setCashReceiptNumber(receiptNumber);
            pay.setCashReceiptType(Pay.CashReceiptType.valueOf(receiptType));
            pay.setCashReceiptStatus(Pay.CashReceiptStatus.APPLIED);
        } else {
            pay.setCashReceiptStatus(Pay.CashReceiptStatus.NOT_APPLIED);
        }

        payRepository.save(pay);
    }

    // 주문 결제 완료 처리
    @Transactional
    public void orderPayComplete(String orderNo) {
        Order order = orderRepository.findByOrderNo(orderNo);
        if (order == null) {
            throw new IllegalArgumentException("주문번호를 찾을 수 없습니다.");
        }

        // 주문 상태 업데이트
        order.setOrderPayStatus("PAID");

        // 테이블 비우기 처리
        Dining dining = order.getDining();
        if (dining != null) {
            dining.freeTable();
            diningRepository.save(dining);
        }
        order.disconnectTable();
        orderRepository.save(order);
    }

    // 결제 내역 조회
    @Transactional(readOnly = true)
    public List<PaymentHistoryResponse> getPaymentHistory(
            String startDate,
            String endDate,
            String posNumber,
            String payMethCd,
            String tableNumber,
            String receiptNumber) {
        return payRepository.findPaymentHistory(startDate, endDate, posNumber, payMethCd, tableNumber, receiptNumber);
    }

    // 오늘 매출 요약 조회
    public Map<String, Object> getTodaySalesSummary() {
        LocalDateTime startDate = LocalDate.now().atStartOfDay();
        LocalDateTime endDate = LocalDate.now().plusDays(1).atStartOfDay();

        Integer totalSales = payRepository.getTodayTotalSales(startDate, endDate);
        Integer cashSales = payRepository.getTodayCashSales(startDate, endDate);
        Integer cardSales = payRepository.getTodayCardSales(startDate, endDate);
        Integer receiptCount = payRepository.getTodayReceiptCount(startDate, endDate);

        Integer vatAmount = (totalSales != null) ? (int) (totalSales / 1.1) : 0;
        Integer netSales = (totalSales != null) ? totalSales - vatAmount : 0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalSales", totalSales == null ? 0 : totalSales);
        summary.put("cashSales", cashSales == null ? 0 : cashSales);
        summary.put("cardSales", cardSales == null ? 0 : cardSales);
        summary.put("receiptCount", receiptCount == null ? 0 : receiptCount);
        summary.put("vatAmount", vatAmount);
        summary.put("netSales", netSales);

        return summary;
    }

    // UUID를 byte[]로 변환
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

    // 카드 번호 마스킹
    private String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            throw new IllegalArgumentException("유효하지 않은 카드 번호입니다.");
        }
        return "*".repeat(cardNumber.length() - 4) + cardNumber.substring(cardNumber.length() - 4);
    }

    // 승인번호 생성
    private String generateApprovalNumber() {
        int approvalNumber = (int) (Math.random() * 900000) + 100000; // 100000 ~ 999999 범위
        return String.valueOf(approvalNumber);
    }
}
