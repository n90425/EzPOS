package com.finalproject.possystem.order.service;


import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.entity.OrderDetail;
import com.finalproject.possystem.order.entity.QOrder;
import com.finalproject.possystem.order.repository.OrderDetailRepository;
import com.finalproject.possystem.order.repository.OrderRepository;
import com.finalproject.possystem.table.entity.Dining;
import com.finalproject.possystem.table.repository.DiningRepository;
import com.finalproject.possystem.table.service.DiningService;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    private OrderDetailRepository orderDetailRepo;

    @Autowired
    private DiningRepository diningRepo;

    @Autowired
    private DiningService diningService;

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


    /* 해당테이블의 주문 읽어오기 */
    public Optional<Order> getOrder(Integer tableNo){
        return orderRepo.findByTableNo(tableNo);
    }

    /* 주문 전체 읽어오기 */
    public List<Order> allOrder(){
        return orderRepo.findAll();
    }

    /* 기간별 주문조회 */
    public List<Order> findOrderByDateRange(LocalDateTime startDate, LocalDateTime endDate){
        return orderRepo.findAllByOrderTimeBetween(startDate, endDate);
    }

    /* 기간별 start와 end 있어야함 + 상태조회 */
    public List<Order> findOrderByDateRangeAndStatus(LocalDateTime startDate, LocalDateTime endDate, String status){
        return orderRepo.findAllByOrderTimeBetweenAndOrderPayStatus(startDate, endDate, status);
    }

    /* 특정날짜 이전조회: endDate만 지정한경우 (처음~end까지조회) */
    public List<Order> findOrderByDateBefore(LocalDateTime endDate){
        return orderRepo.findAllByOrderTimeBefore(endDate);
    }

    /* 특정날짜 이전조회 + 상태코드 (PAID, UNPAID)조회 */
    public List<Order> findOrderByDateBeforeAndStatus(LocalDateTime endDate, String statue){
        return orderRepo.findAllByOrderTimeBeforeAndOrderPayStatus(endDate, statue);
    }

    /* 특정날짜 이후조회: startDate만 지정한경우 (start부터 ~ 끝까지조회) */
    public List<Order> findOrderByDateAfter(LocalDateTime startDate){
        return orderRepo.findAllByOrderTimeAfter(startDate);
    }

    /* 특정날짜 이후조회 + 상태코드 (PAID, UNPAID)조회 */
    public List<Order> findOrderByDateAfterAndStatus(LocalDateTime startDate, String status){
        return orderRepo.findAllByOrderTimeAfterAndOrderPayStatus(startDate, status);
    }


    /* 주문생성 또는 가져오기 */
    @Transactional
    public String createOrGetOrder(int tableNo){
        System.out.println(tableNo);
        /* 선택된 테이블의 테이블번호를 가져온다 */
        Dining dining = diningRepo.findById(tableNo)
                .orElseThrow(() -> new RuntimeException("Table을 찾을수 없습니다"));

        /* dining에 연결된주문이 이미 존재할경우 해당 주문번호를 반환한다 */
        if(dining.getCurrentOrder() != null)
            return dining.getCurrentOrder().getOrderNo();

        /* 새로운 주문번호 생성 */
        String orderNo = createOrderId();
        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setDining(dining); /* 선택된 테이블 번호를 주문테이블과 연결 */
        order.setOrderTime(LocalDateTime.now());
        order.setOrderPayStatus("UNPAID");
        order.setOrderAmount(0.0);
        order.setOrderVat(0.0);
        /* 주문 저장 */
        order = orderRepo.save(order);
        System.out.println("createOrGetOrder: "+order);

        /* Dining테이블에 업데이트 */
        dining.setCurrentOrder(order);
        diningService.updateTableStatus(tableNo, order, false);
        diningRepo.save(dining);

        return orderNo;
    }


    /* 주문의 상태를 PAID 로 바꾸고, 연결되어있는 테이블과의 연관관계를 해제한다 */
    @Transactional
    public void orderAfterPayment(String orderNo){
        Order order = orderRepo.findById(orderNo)
                .orElseThrow(() -> new IllegalArgumentException("주문번호를 찾을수 없습니다."));

        /* 결제상태를 PAID로 변경 */
        order.setOrderPayStatus("PAID");
        /* 테이블번호를 직접 storedTableNo 컬럼에 저장하고 다이닝 테이블과의 관계끊기 */
        order.disconnectTable();
        /* 주문저장 */
        orderRepo.save(order);
    }


}
