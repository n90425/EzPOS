package com.finalproject.possystem.order.repository;

import com.finalproject.possystem.order.entity.QOrderDetail;
import com.finalproject.possystem.order.entity.QOrderSequence;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Service
public class OrderSequenceRepositoryCustomImpl implements OrderSequenceRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager;

    /* em과 factory 초기화 */
    public OrderSequenceRepositoryCustomImpl(EntityManager entityManager){
        this.entityManager = entityManager;
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    @Override
    public List<Integer> findByOrderDate(Date orderDate) {
        return queryFactory.
                select(QOrderSequence.orderSequence.totalSales)
                .from(QOrderSequence.orderSequence)
                .where(QOrderSequence.orderSequence.openDate.eq(orderDate))
                .stream().toList();
    }
}
