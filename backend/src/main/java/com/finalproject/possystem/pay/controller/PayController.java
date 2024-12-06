package com.finalproject.possystem.pay.controller;

import com.finalproject.possystem.pay.entity.CardPaymentRequest;
import com.finalproject.possystem.pay.entity.CashReceiptRequest;
import com.finalproject.possystem.pay.entity.CashReceiptResponse;
import com.finalproject.possystem.pay.service.PayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pay")
public class PayController {

    private final PayService payService;

    public PayController(PayService payService) {
        this.payService = payService;
    }

    @PostMapping("/cash-receipt")
    public ResponseEntity<CashReceiptResponse> handleCashPayment(@RequestBody CashReceiptRequest request) {
        CashReceiptResponse response = new CashReceiptResponse();

        try {
            if (request.getReceiptNumber() == null) {
                System.out.println("Processing cash payment without receipt for orderNo: " + request.getOrderNo());
                payService.processCashPayment(request.getOrderNo());

                /* Order테이블 결제상태 변경 및 테이블해제 */
                payService.orderPayComplete(request.getOrderNo());

                response.setStatus("SUCCESS");
                response.setMessage("현금 결제가 완료되었습니다. (영수증 발급 없음)");
                return ResponseEntity.ok(response);
            }

            if (request.getReceiptNumber().isEmpty()) {
                response.setStatus("FAILURE");
                response.setMessage("현금 영수증 번호가 유효하지 않습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            System.out.println("Processing cash receipt for orderNo: " + request.getOrderNo());
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

    //카드결제
    @PostMapping("/card-payment")
    public ResponseEntity<Map<String, String>> handleCardPayment(@RequestBody CardPaymentRequest request) {
        try {
            // 카드 결제 처리 (orderNo만 전달)
            payService.processCardPayment(
                    request.getOrderNo(),
                    request.getCardNumber(),
                    request.getExpiryDate(),
                    request.getCvv()
            );

            /* Order테이블 결제상태 변경 및 테이블해제 */
            payService.orderPayComplete(request.getOrderNo());

            // 성공 응답 반환
            Map<String, String> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("message", "카드 결제가 완료되었습니다.");
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // 잘못된 요청 처리
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "FAILURE",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            // 서버 오류 처리
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "FAILURE",
                    "message", "결제 처리 중 오류가 발생했습니다."
            ));
        }
    }
}




//@PostMapping("/card-payment")
//public ResponseEntity<Map<String, String>> handleCardPayment(@RequestBody CardPaymentRequest request) {
//    try {
//        payService.processCardPayment(
//                request.getOrderNo(),
//                request.getAmount(),
//                request.getCardNumber(),
//                request.getExpiryDate(),
//                request.getCvv()
//        );
//
//        Map<String, String> response = new HashMap<>();
//        response.put("status", "SUCCESS");
//        response.put("message", "카드 결제가 완료되었습니다.");
//        return ResponseEntity.ok(response);
//
//    } catch (IllegalArgumentException e) {
//        return ResponseEntity.badRequest().body(Map.of(
//                "status", "FAILURE",
//                "message", e.getMessage()
//        ));
//    } catch (Exception e) {
//        return ResponseEntity.internalServerError().body(Map.of(
//                "status", "FAILURE",
//                "message", "결제 처리 중 오류가 발생했습니다."
//        ));
//    }
//}
//}
