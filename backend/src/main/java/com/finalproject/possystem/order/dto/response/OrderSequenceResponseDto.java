package com.finalproject.possystem.order.dto.response;

import com.finalproject.possystem.order.dto.DateType;
import com.finalproject.possystem.order.entity.OrderSequence;
import java.util.ArrayList;
import java.util.stream.Collectors;
import lombok.Getter;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
public class OrderSequenceResponseDto {
    Date OpenDate;
    Boolean isOpen;
    Integer totalOrders;
    Integer totalSales;
    List<Integer> weeklySales;
    
    private Integer todaySales;
    private Integer todayOrders;
    private List<String> Dates;
    
    
    public OrderSequenceResponseDto(Date OpenDate, Boolean isOpen, Integer totalOrders, Integer totalSales){
        this.OpenDate = OpenDate;
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

//    public void updateWeeklySales(List<OrderSequence> sequences, DateType dateType) {
//        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//        List<Integer> total = dateType.totalOrdersandSales(sequences);
//        System.out.println(total);
//        this.totalOrders = total.get(0);
//        this.totalSales = total.get(1);
//        this.weeklySales = sequences.stream()
//                .map(OrderSequence::getTotalSales)
//                .toList();
//        this.Dates = sequences.stream()
//                .map(orderSequence -> dateFormat.format(orderSequence.getOpenDate())) // Date → String 변환
//                .collect(Collectors.toList());
//    }
    
    
    public void updateWeeklySales(List<OrderSequence> sequences, DateType dateType, LocalDate startDate, LocalDate endDate) {
        Map<String, Integer> salesMap = new HashMap<>();
        Map<String, Integer> ordersMap = new HashMap<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (OrderSequence seq : sequences) {
            String dateStr = sdf.format(seq.getOpenDate());
            salesMap.put(dateStr, salesMap.getOrDefault(dateStr, 0) + seq.getTotalSales());
            ordersMap.put(dateStr, ordersMap.getOrDefault(dateStr, 0) + seq.getTotalOrders());
        }

        this.Dates = new ArrayList<>();
        this.weeklySales = new ArrayList<>();

        LocalDate current = startDate;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        while (!current.isAfter(endDate)) {
            String dateStr = current.format(formatter);
            this.Dates.add(dateStr);
            this.weeklySales.add(salesMap.getOrDefault(dateStr, 0));
            current = current.plusDays(1);
        }

        // 총합 매출/주문수 (DateType 기준으로 처리된 값)
        List<Integer> total = dateType.totalOrdersandSales(sequences);
        this.totalOrders = total.get(0);
        this.totalSales = total.get(1);

        // 오늘 매출/주문수 (today 탭용)
        String todayStr = LocalDate.now().format(formatter);
        this.todaySales = salesMap.getOrDefault(todayStr, 0);
        this.todayOrders = ordersMap.getOrDefault(todayStr, 0);
   
    }
}
    

