package com.finalproject.possystem.order.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@NoArgsConstructor
@Getter
@Setter
@Table(name="order_detail")
@Entity
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ordDetailNo;
    private String orderNo;
    private Integer menuId;
    private String ordAddNo;
    private Integer unitPrice;
    private Integer quantity;
    private Integer totalAmount;
    private LocalDateTime itemOrderTime;
}
