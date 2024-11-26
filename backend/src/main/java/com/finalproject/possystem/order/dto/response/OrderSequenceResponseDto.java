package com.finalproject.possystem.order.dto.response;

import com.finalproject.possystem.order.entity.OrderSequence;
import java.util.Date;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
public class OrderSequenceResponseDto {
    Date OpenDate;
    Boolean isOpen;
    Integer totalOrders;
    Integer totalSales;
    List<Integer> weeklySales;
    public OrderSequenceResponseDto(Date OpenDate, Boolean isOpen, Integer totalOrders, Integer totalSales){
        this.OpenDate = OpenDate;
        this.isOpen = isOpen;
        this.totalOrders = totalOrders;
        this.totalSales = totalSales;
    }
    public static OrderSequenceResponseDto from(OrderSequence orderSequence) {
        return new OrderSequenceResponseDto(
                new Date(orderSequence.getOpenDate()),
                orderSequence.getIsOpen(),
                orderSequence.getTotalOrders(),
                orderSequence.getTotalSales());
    }
    public void updateweeklySales(List<Integer> weeklySales) {
        this.weeklySales = weeklySales;
    }
}
