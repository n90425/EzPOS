package com.finalproject.possystem.order.entity;

import com.finalproject.possystem.websocket.dto.OrderDetailStatus;
import jakarta.persistence.*;
import lombok.*;
import com.finalproject.possystem.menu.entity.Menu;

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
    @Column(name = "orderNo", nullable = false, insertable = false, updatable = false)
    private String orderNo;

    @Column(name = "menuId", nullable = false)
    private Integer menuId;

    @Column(name = "menuName", nullable = false)
    private String menuName;

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

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderDetailStatus status;

    @ManyToOne
    @JoinColumn(name = "orderNo", referencedColumnName = "orderNo", nullable = false)
    private Order order;

}
