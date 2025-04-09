package com.finalproject.possystem.pay.controller;

import com.finalproject.possystem.order.service.OrderService;
import com.finalproject.possystem.pay.entity.*;
import com.finalproject.possystem.order.entity.*;

import com.finalproject.possystem.pay.service.PayService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pay")
public class PayController {

    private final PayService payService;
    private final OrderService orderService;

    public PayController(PayService payService, OrderService orderService) {
        this.payService = payService;
		this.orderService = orderService;
    }

    //현금결제 처리
    @PostMapping("/cash-receipt")
    public ResponseEntity<CashReceiptResponse> handleCashPayment(@RequestBody CashReceiptRequest request) {
        CashReceiptResponse response = new CashReceiptResponse();
        System.out.println("request:::::"+request);
        System.out.println("response:::::"+response);

        try {
        	//영수증 없이 단순 현금처리
            if (request.getReceiptNumber() == null) {
                System.out.println("Processing cash payment without receipt for orderNo: " + request.getOrderNo());
                payService.processCashPayment(request.getOrderNo());

                /* Order테이블 결제상태 변경 및 테이블해제 */
                payService.orderPayComplete(request.getOrderNo());
                response.setStatus("SUCCESS");
                response.setMessage("현금 결제가 완료되었습니다. (영수증 발급 없음)");
                return ResponseEntity.ok(response);
            }
            //영수증 번호가 틀림
            if (request.getReceiptNumber().isEmpty()) {
                response.setStatus("FAILURE");
                response.setMessage("현금 영수증 번호가 유효하지 않습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            System.out.println("Processing cash receipt for orderNo: " + request.getOrderNo());
            
            //현금영수증 처리
            //request의 데이터를 매개변수로 전달하고, 내부에서 savePayment 메서드를 호출함
            String receiptId = payService.processCashReceipt(
                    request.getOrderNo(),
                    request.getReceiptNumber(),
                    request.getReceiptType()
            );

            /* Order테이블 결제상태 변경 및 테이블해제 */
            payService.orderPayComplete(request.getOrderNo());

            response.setStatus("SUCCESS");
            response.setMessage("현금 영수증이 성공적으로 발급되었습니다.");
            response.setReceiptId(receiptId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            System.err.println("IllegalArgumentException: " + e.getMessage());
            response.setStatus("FAILURE");
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            System.err.println("Exception occurred: " + e.getMessage());
            e.printStackTrace(); // 전체 스택 트레이스 출력
            response.setStatus("FAILURE");
            response.setMessage("결제 처리 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(response);
        }
    }


    
    //토스결제
    @PostMapping("/toss-payment")
    public ResponseEntity<?> handelTossPayment(@RequestBody CardPaymentRequest request){
    	try {
            
            //PayService 클래스의 메서드 호출(승인요청, 카드내역 저장, 주문상태 변경)
            String result = payService.hanleTossPayment(request);
            
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "FAILURE",
                "message", e.getMessage()
            ));
        } catch (Exception e) {
        	e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "FAILURE",
                "message", "Toss 결제 처리 중 오류가 발생했습니다."
            ));
        }
    }


    //결제 내역 조회
    @GetMapping("/payhistory")
    public ResponseEntity<List<PaymentHistoryResponse>> getPaymentHistory(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String posNumber,
            @RequestParam(required = false) String payMethCd,
            @RequestParam(required = false) String tableNumber,
            @RequestParam(required = false) String receiptNumber) {

        List<PaymentHistoryResponse> paymentHistories = payService.getPaymentHistory(
                startDate != null ? startDate.toString() : null,
                endDate != null ? endDate.toString() : null,
                posNumber,
                payMethCd,
                tableNumber,
                receiptNumber
        );
        System.out.println("paymentMethod11111" + payMethCd);
        return ResponseEntity.ok(paymentHistories);
    }


    // main페이지에  일일 매출요약 가져오기
    @GetMapping("/today-summary")
    public ResponseEntity<Map<String, Object>> getTodaySalesSummary() {
        Map<String, Object> summary = payService.getTodaySalesSummary();
        return ResponseEntity.ok(summary);
    }


}

