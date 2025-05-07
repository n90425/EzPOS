package com.finalproject.possystem.order.dto.response;

import com.finalproject.possystem.order.dto.DateType;
import com.finalproject.possystem.order.entity.OrderSequence;
import java.util.ArrayList;
import lombok.Getter;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Setter
@Getter
public class OrderSequenceResponseDto {
    
	private List<String> Dates;         // x축 날짜 리스트
    private List<Integer> weeklySales;  // y축 매출 리스트
    
    //영업여부
    private boolean isOpen;
    
    //총 주문,매출
    private Integer totalOrders;
    private Integer totalSales;
        
    //오늘용 
    private Integer todaySales;
    private Integer todayOrders;
    
    
    //단일 날짜
    private LocalDate date;
    
    //생성자
    public OrderSequenceResponseDto(Date openDate, Boolean isOpen, Integer totalOrders, Integer totalSales) {
        this.date = openDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        this.isOpen = isOpen != null ? isOpen : false;
        this.totalOrders = totalOrders;
        this.totalSales = totalSales;
    }
    
    //생성자 (달력용)
    public OrderSequenceResponseDto(LocalDate date, Integer totalSales, Integer totalOrders, Boolean isOpen) {
        this.date = date;
        this.totalSales = totalSales;
        this.totalOrders = totalOrders;
        this.isOpen = isOpen != null ? isOpen : false;
    }

    
    //정적 생성자
    public static OrderSequenceResponseDto from(OrderSequence orderSequence) {
        return new OrderSequenceResponseDto(
                orderSequence.getOpenDate(),
                orderSequence.getIsOpen(),
                orderSequence.getTotalOrders(),
                orderSequence.getTotalSales());
    }
    
    //날짜 범위 필터링 메서드
    private List<OrderSequence> filterSequencesInRange(List<OrderSequence> sequences, LocalDate startDate, LocalDate endDate) {
        return sequences.stream()
            .filter(seq -> {
                LocalDate seqDate = seq.getOpenDate().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();
                return !seqDate.isBefore(startDate) && !seqDate.isAfter(endDate);
            })
            .toList();
    }

    
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

        // 총합 매출/주문수 (날짜 범위에 맞게 필터링 후 계산)
        List<OrderSequence> filtered = filterSequencesInRange(sequences, startDate, endDate);
        this.totalOrders = filtered.stream().mapToInt(OrderSequence::getTotalOrders).sum();
        this.totalSales = filtered.stream().mapToInt(OrderSequence::getTotalSales).sum();
        

        // 오늘 매출/주문수 (today 탭용)
        String todayStr = LocalDate.now().format(formatter);
        this.todaySales = salesMap.getOrDefault(todayStr, 0);
        this.todayOrders = ordersMap.getOrDefault(todayStr, 0);
   
    }
    
    
}
    

