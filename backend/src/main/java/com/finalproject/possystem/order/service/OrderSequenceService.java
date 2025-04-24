package com.finalproject.possystem.order.service;

import com.finalproject.possystem.order.dto.DateType;
import com.finalproject.possystem.order.dto.response.OrderSequenceResponseDto;
import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.entity.OrderSequence;
import com.finalproject.possystem.order.entity.QOrderSequence;
import com.finalproject.possystem.order.repository.OrderSequenceRepository;
import com.finalproject.possystem.order.repository.OrderSequenceRepositoryCustom;
import com.finalproject.possystem.pay.repository.PayRepository;
import com.finalproject.possystem.pay.service.PayService;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;


@Service
public class OrderSequenceService {
    private final PayRepository payRepository;
    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager;

    public OrderSequenceService(PayRepository payRepository, EntityManager entityManager) {
        this.payRepository = payRepository;
        this.entityManager = entityManager;
        this.queryFactory = new JPAQueryFactory(entityManager);
    }


    @Autowired
    private OrderSequenceRepository orderSequenceRepo;

    /* 오늘날짜와 일치하는 id 찾기 */
    public Optional<OrderSequence> getOrderSequenceToday() {
        QOrderSequence orderSequence = QOrderSequence.orderSequence;

        /* 오늘날짜를 yyyy-MM-dd 형식으로 생성 */
        Date today = Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());

        /* openDate가 오늘날짜와 일치하는 한건을 선택 */
        OrderSequence result = queryFactory.selectFrom(orderSequence)
                .where(orderSequence.openDate.eq(today))
                .fetchOne();
        return Optional.ofNullable(result);
    }

    /* 영업이 시작됨 */
    @Transactional
    public void startOpen() {
        /* 오늘날짜를 yyyy-MM-dd 형식으로 생성 */
        Date today = Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());
        /* 오늘날짜와 일치하는 id 가져오기 */
        Optional<OrderSequence> exist = getOrderSequenceToday();

        /* 오늘날짜의 id가 없을경우 */
        if (exist.isEmpty()) {
            OrderSequence newSequence = new OrderSequence();
            newSequence.setOpenDate(today);
            newSequence.setIsOpen(true);
            newSequence.setTotalOrders(0);
            newSequence.setTotalSales(0);

            entityManager.persist(newSequence);
        } else { /* id가 존재할경우 */
            /* 객체를 가져온다 */
            OrderSequence sequence = exist.get();

            /* isOpen 상태일경우 예외발생 */
            if (sequence.getIsOpen()) {
                throw new IllegalStateException("이미 영업중 입니다.");
            }

            /* 기존데이터가 있지만 영업이 종료된경우 다시 영업버튼을 누를경우 */
            sequence.setIsOpen(true); /* 영업상태를 열림으로 변경 */
            entityManager.merge(sequence); /* 이렇게하면 기존 판매 데이터는 유지할수있다 */
        }
    }

    /* 영업이 마감됨 */
    @Transactional
    public void close() {
        /* 오늘날짜와 일치하는 id 가져오기 */
        Optional<OrderSequence> exist = getOrderSequenceToday();

        /* 일치하는 id가 없을경우 */
        if (exist.isEmpty()) {
            throw new IllegalStateException("오늘 영업기록이 없습니다. 영업을 시작하지 않았습니다.");
        }
        /* 일치하는 객체를 가져온다 */
        OrderSequence sequence = exist.get();

        /* 가게의 isOpen이 false 인경우 */
        if (!sequence.getIsOpen()) {
            throw new IllegalStateException("이미 영업이 종료되었습니다.");
        }

        /* 영업상태를 종료로 변경 */
        sequence.setIsOpen(false);

        /* 하루의 매출과 주문수를 계산하기위한 메서드를 호출한다 */
        updateSalesToday(sequence);
    }


    /* 하루의 매출과 주문수 계산 */
    public void updateSalesToday(OrderSequence sequence){
        /* 마감시 하루치 결제 총금액 가져오기 */
        LocalDateTime startDate = LocalDate.now().atStartOfDay();
        LocalDateTime endDate = LocalDate.now().plusDays(1).atStartOfDay();

        Integer totalSales = payRepository.getTodayTotalSales(startDate, endDate);
        totalSales = totalSales == null ? 0 : totalSales;
        sequence.setTotalSales(totalSales);

        /* 하루치 영수 건수 가져오기 */
        Integer receiptCount = payRepository.getTodayReceiptCount(startDate, endDate);
        receiptCount = receiptCount == null ? 0 : receiptCount;
        sequence.setTotalOrders(receiptCount);

        entityManager.merge(sequence);
    }

    
    public OrderSequenceResponseDto getOrderDashInfo(LocalDateTime searchDate, DateType dateType) {
    	LocalDateTime targetDate = DateType.resolveTargetDate(searchDate);
    	LocalDate localDate = targetDate.toLocalDate();
    	
    	LocalDate start;
    	LocalDate end;
    	
    	switch (dateType) {
	    	case YESTERDAY -> {
	    		start = localDate;
	    		end = localDate;
	    	}
	    	case DAY -> {
	            start = localDate;
	            end = localDate;
	        }
	        case WEEK -> {
	            start = localDate.minusDays(localDate.getDayOfWeek().getValue() - 1); // 월요일
	            end = start.plusDays(6); // 일요일
	        }
	        case MONTH -> {
	            start = localDate.withDayOfMonth(1);
	            end = localDate.withDayOfMonth(localDate.lengthOfMonth());
	        }
	        default -> {
	            start = localDate;
	            end = localDate;
	        }
    	}
    	
    	LocalDateTime startDate = start.atStartOfDay();
    	LocalDateTime endDate = end.plusDays(1).atStartOfDay();
    	
    	List<OrderSequence> sequences = orderSequenceRepo.findOrderSequencesInWeek(startDate, endDate);
    	
    	
    	// 기준이 되는 OrderSequence 하나 선택 (localDate 기준)
        OrderSequence baseSequence = sequences.stream()
            .filter(seq -> seq.getOpenDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().equals(localDate))
            .findFirst()
            .orElse(sequences.isEmpty() ? null : sequences.get(0));

        if (baseSequence == null) {
            throw new IllegalStateException("해당 범위에 OrderSequence 데이터가 없습니다.");
        }

        OrderSequenceResponseDto responseDto = OrderSequenceResponseDto.from(baseSequence);
        responseDto.updateWeeklySales(sequences, dateType, start, end); // 시작~끝 범위 함께 넘김
        return responseDto;
        
    }
    
    
    public List<OrderSequenceResponseDto> getMonthlySales(int year, int month){
    	
    	LocalDate start = LocalDate.of(year, month, 1);
    	LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
    	
    	List<OrderSequence> sequences = orderSequenceRepo.findOrderSequencesInWeek(
    		start.atStartOfDay(),
    		end.plusDays(1).atStartOfDay()
    	);
    	
    	return sequences.stream()
                .map(seq -> new OrderSequenceResponseDto(
                        seq.getOpenDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
                        seq.getTotalSales(),
                        seq.getTotalOrders(),
                        seq.getIsOpen()
                ))
                .toList();
    }
}




//// 대상 날짜로 OrderSequence 조회	황정하 코드
//OrderSequence sequence = orderSequenceRepo.findByOpenDate(targetDate)
//      .orElseThrow(() -> new IllegalStateException("영업이 시작되지 않았습니다. 영업을 시작하세요."));
//
//LocalDateTime startDate = dateType.calculateStartDate(targetDate);
//OrderSequenceResponseDto orderSequenceResponseDto = OrderSequenceResponseDto.from(sequence);
//
//orderSequenceResponseDto.updateWeeklySales(orderSequenceRepo.findOrderSequencesByDateRange(startDate, targetDate, dateType), dateType);
//return orderSequenceResponseDto;

