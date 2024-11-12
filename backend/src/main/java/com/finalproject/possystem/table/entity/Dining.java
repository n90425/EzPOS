package com.finalproject.possystem.table.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.finalproject.possystem.order.entity.Order;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;


@Table(name="dining")
@Entity
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

    public Dining(){}

    public Dining(Integer tableNo, BigDecimal xPosition, BigDecimal yPosition, String tableColor, BigDecimal width, BigDecimal height) {
        this.tableNo = tableNo;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.tableColor = tableColor;
        this.width = width;
        this.height = height;
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

    @Override
    public String toString() {
        return "Dining{" +
                "tableNo=" + tableNo +
                ", xPosition=" + xPosition +
                ", yPosition=" + yPosition +
                ", tableColor='" + tableColor + '\'' +
                ", width=" + width +
                ", height=" + height +
                '}';
    }
}
