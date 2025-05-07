package com.finalproject.possystem.websocket.dto;

/**
 * NORMAL: 정상 주문 상태
 * CANCEL: 주문이 취소된 상태
 * COMPLETED: 조리가 완료된 상태
 * @author 다니
 * @since 2025-04-30
 */
public enum OrderDetailStatus {
    NORMAL, /*일반주문*/
    CANCEL, /*주문취소*/
    COMPLETED /*조리완료*/
}
