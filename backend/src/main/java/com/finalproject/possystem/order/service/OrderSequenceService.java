package com.finalproject.possystem.order.service;

import com.finalproject.possystem.order.dto.response.OrderSequenceResponseDto;
import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.entity.OrderSequence;
import com.finalproject.possystem.order.entity.QOrderSequence;
import com.finalproject.possystem.order.repository.OrderSequenceRepository;
import com.finalproject.possystem.order.repository.OrderSequenceRepositoryCustom;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;

import java.time.ZoneId;
import java.util.ArrayList;
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

    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager;

    /* em과 factory 초기화 */
    public OrderSequenceService(EntityManager entityManager){
        this.entityManager = entityManager;
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    @Autowired
    private OrderSequenceRepository orderSequenceRepo;


    /* 오늘날짜와 일치하는 id 찾기 */
    public Optional<OrderSequence> getOrderSequenceToday(){
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
        Date today = Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());
        /* 오늘날짜와 일치하는 id 가져오기 */
        Optional<OrderSequence> exist = getOrderSequenceToday();

        /* 오늘날짜의 id가 없을경우 */
        if (exist.isEmpty()) {
            OrderSequence newSequence = new OrderSequence();
            newSequence.setOpenDate(today);
            newSequence.setIsOpen(true);
            newSequence.setCurrentSequence(0);
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
            sequence.setCurrentSequence(0); /* 새로운 주문번호 시퀀스를 0으로 초기화 */
            entityManager.merge(sequence); /* 이렇게하면 기존 판매 데이터는 유지할수있다 */
        }
    }

    /* 영업이 마감됨 */
    @Transactional
    public void close() {
        /* 오늘날짜와 일치하는 id 가져오기 */
        Optional<OrderSequence> exist = getOrderSequenceToday();

        /* 일치하는 id가 없을경우 */
        if(exist.isEmpty()){
            throw new IllegalStateException("오늘 영업기록이 없습니다. 영업을 시작하지 않았습니다.");
        }
        /* 일치하는 객체를 가져온다 */
        OrderSequence sequence = exist.get();

        /* 가게의 isOpen이 false 인경우 */
        if(!sequence.getIsOpen()){
            throw new IllegalStateException("이미 영업이 종료되었습니다.");
        }

        /* 영업상태를 종료로 변경 */
        sequence.setIsOpen(false);
        entityManager.merge(sequence);
    }


    /* 주문번호 시퀀스 증가 */
    public void updateCurrentSequence(Date openDate){
        QOrderSequence orderSequence = QOrderSequence.orderSequence;

        queryFactory.update(orderSequence)
                .set(orderSequence.currentSequence, orderSequence.currentSequence.add(1))
                .where(orderSequence.openDate.eq(openDate))
                .execute();
    }

    /* 주문번호 생성 */
    public String generateOrderNumber() {
        Date today = Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());
        /* 오늘날짜와 일치하는 id 가져오기 */
        Optional<OrderSequence> sequenceOpt = getOrderSequenceToday();

        /* id가 없거나, open상태가 false 인경우 */
        if(sequenceOpt.isEmpty() || !sequenceOpt.get().getIsOpen()){
            throw new IllegalStateException("영업이 시작되지 않았습니다. 영업을 시작하세요.");
        }
        /* 시퀀스 증가 */
        updateCurrentSequence(today);

        /* id가 null일경우 예외발생 */
        OrderSequence sequence = getOrderSequenceToday().orElseThrow();
        /* 객체의 현재 주문번호 sequence를 가져온다 */
        int currentSequence = sequence.getCurrentSequence();

        /* 주문번호 생성 */
        return String.format("%s-%06d", today.toString().replace("-", ""), currentSequence);
    }

    public OrderSequenceResponseDto getOrderDashInfo(Date searchDate){
        Date targetDate = (searchDate == null) ? new Date() : searchDate;

        // 대상 날짜로 OrderSequence 조회
        OrderSequence sequence = orderSequenceRepo.findByOpenDate(targetDate)
                .orElseThrow(() -> new IllegalStateException(
                        "영업이 시작되지 않았습니다. 영업을 시작하세요."
                ));
        OrderSequenceResponseDto orderSequenceResponseDto = OrderSequenceResponseDto.from(sequence);
        orderSequenceResponseDto.updateweeklySales(orderSequenceRepo.findByOrderDate(searchDate));
        return orderSequenceResponseDto;
    }

}
