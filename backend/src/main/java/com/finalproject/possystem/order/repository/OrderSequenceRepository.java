package com.finalproject.possystem.order.repository;

import com.finalproject.possystem.order.entity.OrderSequence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.Optional;

public interface OrderSequenceRepository extends JpaRepository<OrderSequence, Date> {

}
