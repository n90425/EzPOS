package com.finalproject.possystem.pay.entity;

public interface PaymentHistoryResponse {
    String getPaymentTime();
    String getTableNumber();
    int getPaymentAmount();
    String getReceiptNumber();
}
