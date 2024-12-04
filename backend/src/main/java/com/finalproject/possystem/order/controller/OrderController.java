package com.finalproject.possystem.order.controller;


import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.entity.OrderDetail;
import com.finalproject.possystem.order.service.OrderDetailService;
import com.finalproject.possystem.order.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderDetailService orderDetailService;

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);


    /* 기간별주문조회 */
    @GetMapping("/order/all")
    public List<Order> getOrderByDateRange(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "status", required = false) String status
    ) {
        logger.info("startDate = {}, endDate = {}, status = {}", startDate, endDate, status);
        LocalDateTime start = null;
        LocalDateTime end = null;

        try {
            if (startDate != null && !startDate.isEmpty()) {
                start = LocalDateTime.parse(startDate);
            }
            if (endDate != null && !endDate.isEmpty()) {
                end = LocalDateTime.parse(endDate);
            }
        } catch (Exception e) {
            logger.error("날짜 파싱 중 오류 발생: {}", e.getMessage());
            throw new IllegalArgumentException("잘못된 날짜 형식입니다.");
        }


        /* start와 end 모두없는경우 전체조회 */
        if(start == null && end ==null){
            return orderService.allOrder();
        }

        /* 특정날짜 이전조회: endDate만 지정한경우 (처음~end까지조회) */
        if(start == null){
            return status != null
                    ? orderService.findOrderByDateBeforeAndStatus(end, status)
                    : orderService.findOrderByDateBefore(end);
        }

        /* 특정날짜 이후조회: startDate만 지정한경우 (start부터 ~ 끝까지조회) */
        if(end == null){
            return status != null
                    ? orderService.findOrderByDateAfterAndStatus(start,status)
                    : orderService.findOrderByDateAfter(start);
        }

        /* start와 end 모두 있는경우 */
        return status != null
                ?orderService.findOrderByDateRangeAndStatus(start, end, status)
                :orderService.findOrderByDateRange(start, end);
    }

    /* 선택된 테이블에서 주문생성 */
    @PostMapping("/order/{tableNo}")
    public ResponseEntity<String> addToOrder(@PathVariable int tableNo){
        try {
            /* 주문생성 또는 가져오기 */
            String orderNo = orderService.createOrGetOrder(tableNo);

            return ResponseEntity.ok(orderNo);
        } catch (RuntimeException e){
            logger.error("Error fail logger: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("주문생성/조회중 오류발생"+e.getMessage());
        }
    }

    /* 주문 1건 조회 */
    @GetMapping("/order/{tableNo}")
    public ResponseEntity<String> readOrder(@PathVariable Integer tableNo){
        try {
            Optional<Order> order = orderService.getOrder(tableNo); // 서비스에서 주문을 가져옴
            if (order.isEmpty()) {
                // 주문이 없는 경우
                return ResponseEntity.ok("해당 테이블 번호에 대한 주문이 없습니다.");
            }
            // 주문이 있는 경우
            return ResponseEntity.ok(order.get().getOrderNo());
        } catch (Exception e) {
            // 기타 예외 처리
            logger.error("주문 조회 중 예외 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("주문 조회 중 오류 발생: " + e.getMessage());
        }
    }

    /* 주문 업데이트 */


}
