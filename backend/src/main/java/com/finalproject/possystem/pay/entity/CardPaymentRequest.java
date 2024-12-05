package com.finalproject.possystem.pay.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CardPaymentRequest {
    private String orderNo;    // 주문번호
    private String cardNumber; // 카드 번호
    private String expiryDate; // 유효기간 (MM/YY)
    private String cvv;        // 카드 보안 코드
}
