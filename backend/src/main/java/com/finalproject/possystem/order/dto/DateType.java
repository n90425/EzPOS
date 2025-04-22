package com.finalproject.possystem.order.dto;

import com.finalproject.possystem.order.entity.OrderSequence;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public enum DateType {
    DAY {
        @Override
        public LocalDateTime calculateStartDate(LocalDateTime targetDate) {
            return targetDate.minusDays(7); // 오늘
        }
        @Override
        public List<Integer> totalOrdersandSales(List<OrderSequence> sequences) {

            LocalDate  startDay= sequences.stream()
                    .map(order -> toLocalDate(order.getOpenDate()))
                    .max(LocalDate::compareTo)
                    .orElse(LocalDate.now());
            Integer[] total = sequences.stream()
                    .filter(order -> {
                        LocalDate orderDate = toLocalDate(order.getOpenDate());
                        return orderDate.equals(startDay);
                    })
                    .reduce(new Integer[]{0, 0}, (acc, order) -> {
                        acc[0] += order.getTotalOrders(); // 총 주문
                        acc[1] += order.getTotalSales();  // 총 매출
                        return acc;
                    }, (acc1, acc2) -> new Integer[]{
                            acc1[0] + acc2[0],
                            acc1[1] + acc2[1]
                    });
            return List.of(total[0], total[1]);
        }
    },
    YESTERDAY {
        @Override
        public LocalDateTime calculateStartDate(LocalDateTime targetDate) {
            return targetDate.minusDays(7); // 어제
        }
        @Override
        public List<Integer> totalOrdersandSales(List<OrderSequence> sequences) {

            LocalDate  startDay= sequences.stream()
                    .map(order -> toLocalDate(order.getOpenDate()))
                    .max(LocalDate::compareTo)
                    .orElse(LocalDate.now());
            Integer[] total = sequences.stream()
                    .filter(order -> {
                        LocalDate orderDate = toLocalDate(order.getOpenDate());
                        return orderDate.equals(startDay);
                    })
                    .reduce(new Integer[]{0, 0}, (acc, order) -> {
                        acc[0] += order.getTotalOrders(); // 총 주문
                        acc[1] += order.getTotalSales();  // 총 매출
                        return acc;
                    }, (acc1, acc2) -> new Integer[]{
                            acc1[0] + acc2[0],
                            acc1[1] + acc2[1]
                    });
            return List.of(total[0], total[1]);
        }
    },
    WEEK {
        @Override
        public LocalDateTime calculateStartDate(LocalDateTime targetDate) {
            return targetDate.minusDays(49); // 지난 6주
        }
        @Override
        public List<Integer> totalOrdersandSales(List<OrderSequence> sequences) {
            LocalDate latestDay = sequences.stream()
                    .map(order -> toLocalDate(order.getOpenDate()))
                    .max(LocalDate::compareTo)
                    .orElse(LocalDate.now());
            System.out.println("latestDay == " + latestDay);
            LocalDate startDay = latestDay.minusDays(7);
            System.out.println("startDay == " + startDay);
            Integer[] total = sequences.stream()
                    .filter(order -> {
                        LocalDate orderDate = toLocalDate(order.getOpenDate());
                        return !orderDate.isBefore(startDay);
                    })
                    .reduce(new Integer[]{0, 0}, (acc, order) -> {
                        acc[0] += order.getTotalOrders(); // 총 주문
                        acc[1] += order.getTotalSales();  // 총 매출
                        return acc;
                    }, (acc1, acc2) -> new Integer[]{
                            acc1[0] + acc2[0],
                            acc1[1] + acc2[1]
                    });

            return List.of(total[0], total[1]);
        }
    },
    MONTH {
        @Override
        public LocalDateTime calculateStartDate(LocalDateTime targetDate) {
            return targetDate.minusMonths(7); // 지난 6개월
        }
        @Override
        public List<Integer> totalOrdersandSales(List<OrderSequence> sequences) {
            YearMonth latestMonth = sequences.stream()
                    .map(order -> toYearMonth(order.getOpenDate()))
                    .max(YearMonth::compareTo)
                    .orElse(YearMonth.now()); // 데이터가 없을 경우 현재 월 사용
            Integer[] total = sequences.stream()
                    .filter(order -> toYearMonth(order.getOpenDate()).equals(latestMonth))
                    .reduce(new Integer[]{0, 0}, (acc, order) -> {
                        acc[0] += order.getTotalOrders(); // 총 주문
                        acc[1] += order.getTotalSales();  // 총 매출
                        return acc;
                    }, (acc1, acc2) -> new Integer[]{
                            acc1[0] + acc2[0],
                            acc1[1] + acc2[1]
                    });

            return List.of(total[0], total[1]);
        }

    };

    // 기본 메서드 정의
    public abstract LocalDateTime calculateStartDate(LocalDateTime targetDate);

    // 탭 별로 총 오더수 총 금액 다르게 계산
    public abstract List<Integer> totalOrdersandSales(List<OrderSequence> sequences);
    // 유틸리티 메서드: null 처리 및 기본값 반환
    public static LocalDateTime resolveTargetDate(LocalDateTime searchDate) {
        return (searchDate == null) ? LocalDateTime.now() : searchDate;
    }
    // java.util.Date -> java.time.YearMonth 변환 메서드
    private static YearMonth toYearMonth(Date date) {
        return YearMonth.from(date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
    }
    // Date -> LocalDate 변환 메서드
    private static LocalDate toLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

}
