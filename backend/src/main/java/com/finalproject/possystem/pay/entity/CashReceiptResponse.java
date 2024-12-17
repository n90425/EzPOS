package com.finalproject.possystem.pay.entity;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class CashReceiptResponse {
    private String status;      //성공 여부
    private String message;     //저리결과 메세지
    private String receiptId;   //발금된 영수증 ID(성공시)
}
