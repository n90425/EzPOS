package com.finalproject.possystem.pay.entity;

import com.finalproject.possystem.order.entity.Order;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@IdClass(PayId.class)
@Table(name = "`pay`")
public class Pay {
    @Id
    @Column(name = "payNo", columnDefinition = "BINARY(16)")
    private byte[] payNo; // BINARY(16) 타입은 byte[]로 매핑

    @Id
    @Column(name = "paySeqnum")
    private int paySeqnum;

    @Column(name = "orderNo", length = 255)
    private String orderNo;

    @Column(name = "odPayAmt")
    private int odPayAmt;

    @Column(name = "payStatCd", length = 20)
    private String payStatCd;

    @Column(name = "payDt")
    private LocalDateTime payDt;

    @Column(name = "payMethCd", length = 10)
    private String payMethCd;

    @Column(name = "payAprvCd", length = 20)
    private String payAprvCd;

    @Column(name = "payAprvNum", length = 10)
    private String payAprvNum;

    @Column(name = "payAprvDt")
    private LocalDateTime payAprvDt;

    @Column(name = "payRespCd", length = 10)
    private String payRespCd;

    @Column(name = "payCancAmt")
    private Integer payCancAmt; // NULL 가능 컬럼은 Integer로 매핑

    @Column(name = "payCancDt")
    private LocalDateTime payCancDt;

    @Column(name = "transType", length = 20)
    private String transType;

    @Column(name = "cardCo", length = 20)
    private String cardCo;

    @Column(name = "mthInstlmt")
    private Integer mthInstlmt;

    @Column(name = "cardNum", length = 20)
    private String cardNum;

    @Column(name = "bankName", length = 20)
    private String bankName;

    @Column(name = "cash_receipt_number", length = 20)
    private String cashReceiptNumber;

    @Column(name = "cash_receipt_type", columnDefinition = "ENUM('PHONE','BUSINESS')")
    @Enumerated(EnumType.STRING)
    private CashReceiptType cashReceiptType; // ENUM 매핑

    @Column(name = "cash_receipt_status", columnDefinition = "ENUM('APPLIED','NOT_APPLIED')", nullable = false)
    @Enumerated(EnumType.STRING)
    private CashReceiptStatus cashReceiptStatus = CashReceiptStatus.NOT_APPLIED;

    // 외래키 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderNo", insertable = false, updatable = false)
    private Order order;

    public enum CashReceiptType {
        PHONE, BUSINESS
    }

    public enum CashReceiptStatus {
        APPLIED, NOT_APPLIED
    }
}
