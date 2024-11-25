package com.finalproject.possystem.order.repository;

import com.finalproject.possystem.order.entity.QOrderDetail;
import com.finalproject.possystem.order.entity.QOrderSequence;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class OrderSequenceRepositoryCustomImpl implements OrderSequenceRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<Integer> findByOrderDate(Date orderDate) {
        return queryFactory.
                select(QOrderSequence.orderSequence.totalSales)
                .from(QOrderSequence.orderSequence)
                .where(QOrderSequence.orderSequence.openDate.eq(orderDate.toString()))
                .stream().toList();
    }
}
