package com.finalproject.possystem.order.repository;

import com.finalproject.possystem.order.dto.DateType;
import com.finalproject.possystem.order.entity.OrderSequence;
import com.finalproject.possystem.order.repository.OrderSequenceRepositoryCustom;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.sql.Timestamp;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import static com.finalproject.possystem.order.entity.QOrderSequence.orderSequence;

@Repository
public class OrderSequenceRepositoryCustomImpl implements OrderSequenceRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public OrderSequenceRepositoryCustomImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<OrderSequence> findOrderSequencesByDateRange(
            LocalDateTime startDate, LocalDateTime endDate, DateType dateType) {
        System.out.println(Timestamp.valueOf(startDate));
        System.out.println(Timestamp.valueOf(endDate));
        var query = queryFactory.select(orderSequence)
                .from(orderSequence)
                .where(orderSequence.openDate.between(Timestamp.valueOf(startDate),
                        Timestamp.valueOf(endDate)));

        // 그룹핑 조건 추가
        if (dateType == DateType.WEEK) {
            query.groupBy(orderSequence.openDate.year(), orderSequence.openDate.week());
        } else if (dateType == DateType.MONTH) {
            query.groupBy(orderSequence.openDate.year(), orderSequence.openDate.month());
        }

        return query.fetch();
    }
}
