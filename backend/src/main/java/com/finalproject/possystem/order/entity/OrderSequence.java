package com.finalproject.possystem.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@ToString
@Setter
@Getter
@Table(name="`order_sequence`")
@NoArgsConstructor
@Entity
public class OrderSequence {
    @Id
    @Column(name="openDate", nullable = false)
    private String openDate; /* 영업날짜 */

    @Column(name= "isOpen", nullable = false)
    private Boolean isOpen; /* 영업상태 (열림/마감) */

    @Column(name= "currentSequence", nullable = false)
    private int currentSequence; /* 주문 시퀀스 번호 */

    @Column
    private int totalOrders; /* 총 주문수 */

    @Column
    private int totalSales; /* 총 매출액 */

    public OrderSequence(String openDate, Boolean isOpen, int currentSequence, int totalOrders, int totalSales) {
        this.openDate = openDate;
        this.isOpen = isOpen;
        this.currentSequence = currentSequence;
        this.totalOrders = totalOrders;
        this.totalSales = totalSales;
    }
}
