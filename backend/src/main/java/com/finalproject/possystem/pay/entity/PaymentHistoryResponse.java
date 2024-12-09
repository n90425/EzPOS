package com.finalproject.possystem.pay.entity;

public interface PaymentHistoryResponse {
    String getPaymentTime();
    String getTableNumber();
    String getPayMethCd();
    int getPaymentAmount();
    String getReceiptNumber();
}
