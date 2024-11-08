package com.finalproject.possystem.order.service;


import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.entity.QOrder;
import com.finalproject.possystem.order.repository.OrderRepository;
import com.finalproject.possystem.table.entity.Dining;
import com.finalproject.possystem.table.repository.DiningRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepo;
    private DiningRepository diningRepo;
    private JPAQueryFactory queryFactory;

    private Map<String, Integer> dailyCount = new HashMap<>();

    /* 주문번호 생성 */
    public String createOrderId(){
        /* 연월일 뽑아오기 */
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        /* Map에 선택한 연월일이 저장된게 없을경우 주문번호 000000부터 생성 */
        int count = dailyCount.getOrDefault(datePart,0)+1;
        /* 연월일-일련번호 조합 */
        String orderNo = datePart+"-"+String.format("%06d", count);
        /* 맵에 저장 */
        dailyCount.put(datePart, count);
        return orderNo;
    }

    /* 주문 생성 */
    public Order newOrder(Order order){
        String orderNo = createOrderId();
        order.setOrderNo(orderNo);
        return orderRepo.save(order);
    }

    /* 주문 업데이트 */
    public Order updateOrder(Order order){
        Order ord = orderRepo.findById(order.getOrderNo()).orElse(null);
        if(ord == null) return null;

        ord.setOrderPayStatus(order.getOrderPayStatus());
        ord.setOrderAmount(order.getOrderAmount());
        ord.setOrderVat(order.getOrderVat());

        return orderRepo.save(ord);
    }

    /* 테이블 이동 */
    public Order updateTable(String orderNo, int tableNo){
        Order order = orderRepo.findById(orderNo).orElse(null);
        if(order == null) return null;

        Dining dining = diningRepo.findByTableNo(tableNo);
        if(dining == null) return null;

        order.setDining(dining);
        return orderRepo.save(order);
    }

    /* 선택 주문삭제 */
    public void delOrder(String orderNo){
        orderRepo.deleteById(orderNo);
    }


    /* 선택한 주문 읽어오기 */
    public Order getOrder(String orderNo){
        return orderRepo.findByOrderNo(orderNo);
    }

    /* 주문 전체 읽어오기 */
    public List<Order> allOrder(){
        return orderRepo.findAll();
    }


    /* 결제로 넘길까..? 주문 합계 */
    public BigDecimal daysum(LocalDate orderTime, String type, DayOfWeek dayOfWeek){
        QOrder order = QOrder.order;

        LocalDateTime startDay = null;
        LocalDateTime endDay = null;

        /* 당일주문조회 select : 자정부터 다음날까지 */
        if("day".equalsIgnoreCase(type)){
            startDay = orderTime.atStartOfDay();
            endDay = orderTime.plusDays(1).atStartOfDay();

        /* 월주문조회 select : 해당월의 1일부터 다음달 첫날 전까지 */
        } else if ("month".equalsIgnoreCase(type)) {
            YearMonth month = YearMonth.from(orderTime);
            startDay = month.atDay(1).atStartOfDay();
            endDay = month.plusMonths(1).atDay(1).atStartOfDay();

        /* 날짜 주문조회 select : 특정요일에 해당하는 날짜를 조회 */
        } else if ("weekday".equalsIgnoreCase(type)) {
            startDay = orderTime.with(dayOfWeek).atStartOfDay();
            endDay = orderTime.with(dayOfWeek).plusDays(1).atStartOfDay();
        }

        Double result = queryFactory
                .select(order.orderAmount.sum().add(order.orderVat.sum()))
                .from(order)
                .where(order.orderTime.between(startDay, endDay)
                        .and(order.orderTime.dayOfWeek().eq(dayOfWeek.getValue()))
                        .and(order.orderPayStatus.eq("completed")))
                .fetchOne();

        return result != null ? BigDecimal.valueOf(result) : BigDecimal.ZERO;
    }


    /* orderPayStatus 수정 */



}
