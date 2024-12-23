package com.finalproject.possystem.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Date;
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
    private Date openDate; /* 영업날짜 */

    @Column(name= "isOpen", nullable = false)
    private Boolean isOpen; /* 영업상태 (열림/마감) */

    @Column
    private int totalOrders; /* 총 주문수 */

    @Column
    private int totalSales; /* 총 매출액 */

    
}
