package com.finalproject.possystem.order.dto.response;

import com.finalproject.possystem.order.entity.OrderSequence;
import java.util.stream.Collectors;
import lombok.Getter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Getter
public class OrderSequenceResponseDto {
    private final String openDate; // 날짜를 String으로 저장
    private final Boolean isOpen;
    private final Integer totalOrders;
    private final Integer totalSales;
    private List<Integer> weeklySales;
    private List<String> Dates;

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    public OrderSequenceResponseDto(Date openDate, Boolean isOpen, Integer totalOrders, Integer totalSales) {
        this.openDate = openDate != null ? DATE_FORMAT.format(openDate) : null; // 날짜 변환
        this.isOpen = isOpen;
        this.totalOrders = totalOrders;
        this.totalSales = totalSales;
    }

    public static OrderSequenceResponseDto from(OrderSequence orderSequence) {
        return new OrderSequenceResponseDto(
                orderSequence.getOpenDate(),
                orderSequence.getIsOpen(),
                orderSequence.getTotalOrders(),
                orderSequence.getTotalSales());
    }

    public void updateWeeklySales(List<OrderSequence> sequences) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        this.weeklySales = sequences.stream()
                .map(OrderSequence::getTotalSales)
                .toList();
        this.Dates = sequences.stream()
                .map(orderSequence -> dateFormat.format(orderSequence.getOpenDate())) // Date → String 변환
                .collect(Collectors.toList());
    }
}
