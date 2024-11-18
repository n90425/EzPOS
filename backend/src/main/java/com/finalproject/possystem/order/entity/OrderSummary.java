package com.finalproject.possystem.order.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Table(name="Order_summary")
@Entity
@Getter
public class OrderSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderSummaryId;

    private Date orderSummaryDate;
    private Long totalAmount;
    private Integer totalOrderNumber;
    private Boolean isEnd;

    public void EndUpdate(Long totalAmount, Integer totalOrderNumber){
        this.totalAmount = totalAmount;
        this.totalOrderNumber = totalOrderNumber;
        this.isEnd = true;
    }
}
