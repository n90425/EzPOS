package com.finalproject.possystem.pay.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

import java.io.Serializable;
import java.util.Objects;

// 복합 키 클래스는 Serializable을 구현해야 합니다.
public class PayId implements Serializable {
    private byte[] payNo; // BINARY(16) 타입은 byte[]로 매핑
    private int paySeqnum; // 복합 키의 두 번째 필드

    // 기본 생성자
    public PayId() {}

    // 모든 필드를 포함하는 생성자
    public PayId(byte[] payNo, int paySeqnum) {
        this.payNo = payNo;
        this.paySeqnum = paySeqnum;
    }

    // Getter와 Setter
    public byte[] getPayNo() {
        return payNo;
    }

    public void setPayNo(byte[] payNo) {
        this.payNo = payNo;
    }

    public int getPaySeqnum() {
        return paySeqnum;
    }

    public void setPaySeqnum(int paySeqnum) {
        this.paySeqnum = paySeqnum;
    }

    // equals()와 hashCode()는 반드시 구현해야 합니다.
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PayId payId = (PayId) o;
        return paySeqnum == payId.paySeqnum && Objects.equals(payNo, payId.payNo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(payNo, paySeqnum);
    }
}
