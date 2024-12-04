package com.finalproject.possystem.pay.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class CashReceiptRequest {
    private String orderNo;         //주문번호
    private String receiptNumber;   //현금영수증 번호( 핸드폰 or 사업자번호)
    private String receiptType;     //개인 or 사업자
}
