package com.finalproject.possystem.order.entity;

import com.finalproject.possystem.table.entity.Dining;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@ToString
@Setter
@Getter
@Table(name = "`order`")
@NoArgsConstructor
@Entity
public class Order {
    @Id
    @Column(name = "orderNo")
    private String orderNo;

    @OneToOne
    @JoinColumn(name="tableNo", referencedColumnName = "tableNo", nullable = false)
    private Dining dining;

    @Column(name = "orderTime")
    private LocalDateTime orderTime;

    @Column(name = "orderPayStatus")
    private String orderPayStatus;

    @Column(name = "orderAmount")
    private Double orderAmount;

    @Column(name = "orderVat")
    private Double orderVat;

    public Order(String orderNo, Dining dining, LocalDateTime orderTime, String orderPayStatus, Double orderAmount, Double orderVat) {
        this.orderNo = orderNo;
        this.dining = dining;
        this.orderTime = orderTime;
        this.orderPayStatus = orderPayStatus;
        this.orderAmount = orderAmount;
        this.orderVat = orderVat;
    }

}
