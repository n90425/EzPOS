package com.finalproject.possystem.order.dto;

import java.time.LocalDateTime;

public enum DateType {
    DAY {
        @Override
        public LocalDateTime calculateStartDate(LocalDateTime targetDate) {
            return targetDate.minusDays(7); // 오늘
        }
    },
    YESTERDAY {
        @Override
        public LocalDateTime calculateStartDate(LocalDateTime targetDate) {
            return targetDate.minusDays(8); // 어제
        }
    },
    WEEK {
        @Override
        public LocalDateTime calculateStartDate(LocalDateTime targetDate) {
            return targetDate.minusDays(49); // 지난 6주
        }
    },
    MONTH {
        @Override
        public LocalDateTime calculateStartDate(LocalDateTime targetDate) {
            return targetDate.minusMonths(7); // 지난 6개월
        }
    };

    // 기본 메서드 정의
    public abstract LocalDateTime calculateStartDate(LocalDateTime targetDate);

    // 유틸리티 메서드: null 처리 및 기본값 반환
    public static LocalDateTime resolveTargetDate(LocalDateTime searchDate) {
        return (searchDate == null) ? LocalDateTime.now() : searchDate;
    }
}
