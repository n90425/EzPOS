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
    @Column(name="order_no")
    private String orderNo;

//    @Column(name="table_no")
//    private int tableNo;

    @OneToOne
    @JoinColumn(name="table_no", referencedColumnName = "table_no", nullable = false)
    private Dining dining;

    @Column(name="order_time")
    private LocalDateTime orderTime;
    @Column(name="order_pay_status")
    private String orderPayStatus;
    @Column(name="order_amount")
    private Double orderAmount;
    @Column(name="order_vat")
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
