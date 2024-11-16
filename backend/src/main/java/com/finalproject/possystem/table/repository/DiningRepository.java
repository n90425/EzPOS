package com.finalproject.possystem.table.repository;

import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.table.entity.Dining;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DiningRepository  extends JpaRepository<Dining, Integer> {
    Dining findByTableNo(int tableNo);

    /* 비어있는 테이블을 찾기위한 쿼리문 */
    @Query("SELECT d.tableNo FROM Dining d")
    List<Integer> findAllTableNo();
}
