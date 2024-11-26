package com.finalproject.possystem.order.repository;

import com.finalproject.possystem.order.entity.QOrderSequence;
import java.util.Date;
import java.util.List;

public interface OrderSequenceRepositoryCustom {
    List<Integer> findByOrderDate(Date orderDate);
}
