package com.finalproject.possystem.table.repository;

import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.table.entity.Dining;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiningRepository  extends JpaRepository<Dining, Integer> {
    Dining findByTableNo(int tableNo);
}
