package com.finalproject.possystem.order.controller;

import com.finalproject.possystem.order.dto.DateType;
import com.finalproject.possystem.order.dto.response.OrderSequenceResponseDto;
import com.finalproject.possystem.order.entity.OrderSequence;
import com.finalproject.possystem.order.service.OrderSequenceService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shop")
public class OrderSequenceController {
    @Autowired
    OrderSequenceService orderSequenceService;

    /* 영업 시작 */
    @PostMapping("/open")
    public ResponseEntity<String> open(){
        try {
            orderSequenceService.startOpen();
            return ResponseEntity.ok("영업을 시작했습니다.");
        } catch (IllegalStateException e) {
            return ResponseEntity.ok("영업 중 입니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("영업 시작중 오류가 발생하였습니다");
        }
    }

    /* 영업 종료 */
    @PostMapping("/close")
    public ResponseEntity<String> close() {
        try {
            orderSequenceService.close();
            return ResponseEntity.ok("영업을 종료했습니다");
        } catch (IllegalStateException e) {
            return ResponseEntity.ok("이미 영업이 종료되었습니다");
        } catch (Exception e){
            return ResponseEntity.status(500).body("영업 종료중 오류가 발생했습니다");
        }
    }

    /* 현재 영업상태 */
    @GetMapping("/current")
    public ResponseEntity<OrderSequence> currentOrderSequence() {
        try {
            /* 오늘날짜와 일치하는 id 찾기 */
            OrderSequence orderSequence = orderSequenceService.getOrderSequenceToday()
                    .orElseThrow(()-> new IllegalStateException("오늘의 영업 상태를 찾을수 없습니다"));
            return ResponseEntity.ok(orderSequence);
        } catch (IllegalStateException e){
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /* 주문번호 시퀀스 증가 */
//    @PostMapping("/increment-sequence")
//    public ResponseEntity<String> incrementSequence(){
//        try {
//            String today = orderSequenceService.generateOrderNumber();
//            return ResponseEntity.ok("주문 번호가 증가되엇습니다"+today);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("주문번호 증가중 오류가 발생하였습니다");
//        }
//    }


    @GetMapping("/order-sequence-info")
    public ResponseEntity<OrderSequenceResponseDto> orderSequenceInfo(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate searchDate, @RequestParam DateType dateType) {
        LocalDateTime endDay = searchDate.atStartOfDay();
        return ResponseEntity.ok(orderSequenceService.getOrderDashInfo(endDay, dateType));
    }

}
