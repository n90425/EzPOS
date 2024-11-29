package com.finalproject.possystem.table.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.finalproject.possystem.order.entity.Order;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.text.DecimalFormat;


@Table(name="dining")
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Dining {
    @Id
    @Column(name="`tableNo`")
    private Integer tableNo;

    @Column(name = "xPosition", precision = 10, scale = 2)
    private BigDecimal xPosition;

    @Column(name = "yPosition", precision = 10, scale = 2)
    private BigDecimal yPosition;

    @Column(name = "tableColor")
    private String tableColor;

    private BigDecimal width;
    private BigDecimal height;

    /* 테이블이 비어있는지 주문과 연결되어있는지 확인 */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "ENUM('EMPTY', 'OCCUPIED') DEFAULT 'EMPTY'")
    private Status status = Status.EMPTY;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="currentOrderNo", referencedColumnName = "orderNo", foreignKey = @ForeignKey(name="fk_current_order"))
    @JsonBackReference
    private Order currentOrder;



    public enum Status {
        EMPTY, OCCUPIED
    }
    
    public void occupyTable(Order order) {
        this.status = Status.OCCUPIED; /* 테이블 상태를 OCCUPIED로 변경 */
        this.currentOrder = order; /* 현재 주문과 연결 */
    }
    
    public void freeTable() {
        this.status = Status.EMPTY; /* 테이블 상태를 EMPTY로 변경 */
        this.currentOrder = null; /* 현재 주문 해제 */
    }

    public Integer getTableNo() {
        return tableNo;
    }

    public void setTableNo(Integer tableNo) {
        this.tableNo = tableNo;
    }

    public BigDecimal getxPosition() {
        return xPosition;
    }

    public void setxPosition(BigDecimal xPosition) {
        this.xPosition = xPosition;
    }

    public BigDecimal getyPosition() {
        return yPosition;
    }

    public void setyPosition(BigDecimal yPosition) {
        this.yPosition = yPosition;
    }

    public String getTableColor() {
        return tableColor;
    }

    public void setTableColor(String tableColor) {
        this.tableColor = tableColor;
    }

    public BigDecimal getWidth() {
        return width;
    }

    public void setWidth(BigDecimal width) {
        this.width = width;
    }

    public BigDecimal getHeight() {
        return height;
    }

    public void setHeight(BigDecimal height) {
        this.height = height;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Order getCurrentOrder() {
        return currentOrder;
    }

    public void setCurrentOrder(Order currentOrder) {
        this.currentOrder = currentOrder;
    }

    @Override
    public String toString() {
        return "Dining{" +
                "tableNo=" + tableNo +
                ", xPosition=" + xPosition +
                ", yPosition=" + yPosition +
                ", tableColor='" + tableColor + '\'' +
                ", width=" + width +
                ", height=" + height +
                ", status=" + status +
                ", currentOrder=" + currentOrder +
                '}';
    }


}
