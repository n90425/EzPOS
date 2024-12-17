package com.finalproject.possystem.order.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Table(name="order_detail")
@Entity
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ordDetailNo")
    private Integer ordDetailNo;
    @Column(name = "orderNo", nullable = false)
    private String orderNo;
    @Column(name = "menuId", nullable = false)
    private Integer menuId;
    @Column(name = "ordAddNo")
    private Integer ordAddNo;
    @Column(name = "unitPrice", nullable = false)
    private Integer unitPrice;
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    @Column(name = "totalAmount", insertable = false, updatable = false)
    private Integer totalAmount;
    @Column(name = "itemOrderTime", insertable = false, updatable = false)
    private LocalDateTime itemOrderTime;

    @ManyToOne
    @JoinColumn(name = "orderNo", referencedColumnName = "orderNo", insertable = false, updatable = false)
    private Order order;

    /* 총금액 = 가격 * 수량 */
    public void calculateTotalAmount(){
        this.totalAmount = this.unitPrice * this.quantity;
    }
}
