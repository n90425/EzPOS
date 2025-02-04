package com.finalproject.possystem.order.repository;

import com.finalproject.possystem.order.dto.DateType;
import com.finalproject.possystem.order.entity.OrderSequence;
import com.finalproject.possystem.order.entity.QOrderSequence;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface OrderSequenceRepositoryCustom {
    List<OrderSequence> findOrderSequencesByDateRange(
            LocalDateTime startDate, LocalDateTime endDate, DateType dateType);
}
