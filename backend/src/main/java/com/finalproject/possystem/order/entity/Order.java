package com.finalproject.possystem.order.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.finalproject.possystem.table.entity.Dining;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static java.time.LocalTime.now;

@Setter
@Getter
@Table(name = "`order`")
@NoArgsConstructor
@Entity
public class Order {
    @Id
    @Column(name = "orderNo")
    private String orderNo;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name="`tableNo`", referencedColumnName = "`tableNo`", nullable = true)
    @JsonBackReference
    private Dining dining;

    @Column(name = "orderTime")
    private LocalDateTime orderTime;

    @Column(name = "orderPayStatus")
    private String orderPayStatus;

    @Column(name = "orderAmount")
    private Double orderAmount;

    @Column(name = "orderVat")
    private Double orderVat;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails = new ArrayList<>();

    public Order(String orderNo, Dining dining, LocalDateTime orderTime, String orderPayStatus, Double orderAmount, Double orderVat) {
        this.orderNo = orderNo;
        this.dining = dining;
        this.orderTime = orderTime;
        this.orderPayStatus = orderPayStatus;
        this.orderAmount = orderAmount;
        this.orderVat = orderVat;
    }

    /* 주문시간 yyyy-mm-dd AM/PM hh:mm:ss 포맷 */
    public String getOrderDateFormatter(){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd a hh:mm:ss");
        return this.orderTime.format(formatter);
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderNo='" + orderNo + '\'' +
                ", orderTime=" + orderTime +
                ", orderPayStatus='" + orderPayStatus + '\'' +
                ", orderAmount=" + orderAmount +
                ", orderVat=" + orderVat +
                '}';
    }
}
