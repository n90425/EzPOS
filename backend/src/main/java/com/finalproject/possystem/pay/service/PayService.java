package com.finalproject.possystem.pay.service;

import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.entity.OrderSequence;
import com.finalproject.possystem.order.repository.OrderRepository;
import com.finalproject.possystem.order.service.OrderSequenceService;
import com.finalproject.possystem.pay.entity.CardPaymentRequest;
import com.finalproject.possystem.pay.entity.Pay;
import com.finalproject.possystem.pay.entity.PaymentHistoryResponse;
import com.finalproject.possystem.pay.repository.PayRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.finalproject.possystem.table.entity.Dining;
import com.finalproject.possystem.table.repository.DiningRepository;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;


@Service
public class PayService {
    private final PayRepository payRepository;
    private final OrderRepository orderRepository;
    private final DiningRepository diningRepository;
    private final OrderSequenceService orderSequenceService;
    private static final String URL = "https://api.tosspayments.com/v1/payments/confirm";
    
    
    @Value("${secret.key}")
    private String tossSecretKey;

    public PayService(PayRepository payRepository, OrderRepository orderRepository, DiningRepository diningRepository, OrderSequenceService orderSequenceService) {
        this.payRepository = payRepository;
        this.orderRepository = orderRepository;
        this.diningRepository = diningRepository;
        this.orderSequenceService = orderSequenceService;
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

    // 카드결제시 db에 저장
    @Transactional
    public void processCardPayment(String orderNo, String cardNumber, String expiryDate, String cvv) {
        savePayment(orderNo, "CARD", cardNumber, null, null);
    }
    
    
    //토스결제
    /* 전달받은 정보이용 Spring에서 Toss API 서버로 결제 승인 요청 */
    @Transactional
    public String requestTossPaymentConfirm(String paymentKey, String orderId, int amount){
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> body = new HashMap<>();
        body.put("paymentKey", paymentKey);
        body.put("orderId", orderId);
        body.put("amount", amount);

        //시크릿키를 Base64로 인코딩하여 Toss인증방식 적용
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String encodedAuto = Base64.getEncoder().encodeToString((tossSecretKey+":").getBytes());
        System.out.println("tossSecretKey: "+ tossSecretKey);
        headers.set("Authorization", "Basic "+encodedAuto);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
        	//Toss API로 post 요청보내기 (결제승인 처리)
            ResponseEntity<String> response = restTemplate.postForEntity(URL, request, String.class);
            System.out.println("결제 승인 성공: "+ response.getBody());
            return response.getBody();	//Toss서버로쿠터 받은 응답반환
        } catch (HttpClientErrorException | HttpServerErrorException e){
            String errorRes = e.getResponseBodyAsString();
            System.err.println("❌ 결제 승인 실패 응답: " + errorRes);
            throw new RuntimeException("Toss 결제 승인 요청 실패: "+errorRes);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Toss 결제중 알수없는 오류 발생");
        }
    }
    
    
    //Toss결제 전체 처리
    @Transactional
    public String hanleTossPayment(CardPaymentRequest request) {
    	//Toss결제 승인 요청
    	String result = requestTossPaymentConfirm(
    			request.getPaymentKey(),
    			request.getOrderNo(),
    			request.getAmount()
    	);
    	
    	//카드결제 내역 저장
    	processCardPayment(
    			request.getOrderNo(),
    			request.getCardNumber(),
    			request.getExpiryDate(),
    			request.getCvv()
    	);

    	//주문상태 변경
    	orderPayComplete(request.getOrderNo());


    	return result;	//Toss응답 결과 리턴
    }
    

    // 주문결제 기록 저장(공통 결제 저장 로직)
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
//            pay.setCardNum(maskCardNumber(cardNumber)); // 카드번호 마스킹
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

        /* 하루의 매출및 주문수를 OrderSequance에 update 하기위한 코드 */
        Optional<OrderSequence> optional = orderSequenceService.getOrderSequenceToday();
        /* 값이존재하면 updateSalesToday 메서드를 실행 */
        optional.ifPresent(orderSequenceService::updateSalesToday);
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
        summary.put("vatAmount", vatAmount);	//부가세 계산
        summary.put("netSales", netSales);		//순매출 계산

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

    // 승인번호 생성
    private String generateApprovalNumber() {
        int approvalNumber = (int) (Math.random() * 900000) + 100000; // 100000 ~ 999999 범위
        return String.valueOf(approvalNumber);
    }
}
