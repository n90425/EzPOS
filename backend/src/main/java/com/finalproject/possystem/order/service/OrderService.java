package com.finalproject.possystem.order.service;


import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.repository.OrderDetailRepository;
import com.finalproject.possystem.order.repository.OrderRepository;
import com.finalproject.possystem.table.entity.Dining;
import com.finalproject.possystem.table.repository.DiningRepository;
import com.finalproject.possystem.table.service.DiningService;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private DiningRepository diningRepo;

    @Autowired
    private DiningService diningService;


    private static final Object lock = new Object();

    /* 주문번호 생성 */
//    @Transactional
    public String createOrderId(){
        /* 연월일 뽑아오기 */
        synchronized (lock){
            String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

            /* DB에서 현재날짜로 시작하는 orderNo중 가장 큰값 가져오기 */
            String maxOrderNo = orderRepo.findMaxOrderNo(datePart+"%");

            int nextCount;
            /* 만약 해당 날짜로 생성된 주문번호가 없으면 1로 초기화 */
            if(maxOrderNo == null){
                nextCount = 1;
            } else {
                /* 생성된 주문번호가 있을경우 - split 후 1증가 */
                String lastOrderNo = maxOrderNo.substring(maxOrderNo.lastIndexOf('-')+1);
                nextCount = Integer.parseInt(lastOrderNo)+1;
            }

            String orderNo = datePart + "-" + String.format("%06d", nextCount);
            return orderNo;
        }
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

    /* 주문이 존재하고 orderDetail이 비어있을경우 주문을 삭제 */
    @Transactional
    public boolean delOrder(int tableNo){
        Optional<Order> optionalOrder  = orderRepo.findByTableNo(tableNo);

        if(optionalOrder.isPresent()){
            Order order = optionalOrder.get();
            /* 주문상세가 비어있는지 확인 */
            if(order.getOrderDetails().isEmpty()){
                /* Dining 테이블에서 상태와 현재 주문을 연결해제 */
                Dining dining = diningRepo.findById(tableNo).orElseThrow(()-> new RuntimeException("Dining not fount"));

                dining.setStatus(Dining.Status.EMPTY);
                dining.setCurrentOrder(null);

                /* 주문삭제 */
                orderRepo.delete(order);
                return true;
            }
        }
        return false;
    }


    /* 해당테이블의 주문 읽어오기 */
    public Optional<Order> getOrder(Integer tableNo){
        return orderRepo.findByTableNo(tableNo);
    }

    /* 주문 전체 읽어오기 */
    public List<Order> allOrder(){
        return orderRepo.findAll();
    }
    
    public Order findOrder(String orderNo) {
    	return orderRepo.findByOrderNo(orderNo);
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
}
