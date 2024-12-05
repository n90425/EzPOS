package com.finalproject.possystem.order.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.finalproject.possystem.table.entity.Dining;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static java.time.LocalTime.now;

@Setter
@Getter
@Table(name = "`order`")
@NoArgsConstructor
@Entity
public class Order {
    @Id
    @Column(name = "orderNo")
    private String orderNo;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name="`tableNo`", referencedColumnName = "`tableNo`", nullable = true)
    @JsonBackReference
    private Dining dining;

    @Column(name="`storedTableNo`", nullable = true)
    private Integer storedTableNo;

    @Column(name = "orderTime")
    private LocalDateTime orderTime;

    @Column(name = "orderPayStatus")
    private String orderPayStatus;

    @Column(name = "orderAmount")
    private Double orderAmount;

    @Column(name = "orderVat")
    private Double orderVat;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<OrderDetail> orderDetails = new ArrayList<>();

    public Order(String orderNo, Dining dining, Integer storedTableNo, LocalDateTime orderTime, String orderPayStatus, Double orderAmount, Double orderVat) {
        this.orderNo = orderNo;
        this.dining = dining;
        this.storedTableNo = storedTableNo;
        this.orderTime = orderTime;
        this.orderPayStatus = orderPayStatus;
        this.orderAmount = orderAmount;
        this.orderVat = orderVat;
    }

    /* 주문시간 yyyy-mm-dd AM/PM hh:mm:ss 포맷 */
    public String getOrderDateFormatter(){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd a hh:mm:ss");
        return this.orderTime.format(formatter);
    }

    /* 기간별 주문조회시 JSON 직렬화를 위한 tableNo 필드 추가 */
    @Transient
    @JsonProperty("tableNo") // JSON에 tableNo 필드로 포함
    public Integer getTableNo() {
        return dining != null ? dining.getTableNo() : storedTableNo;
    }

    /* 결제 이후 테이블과의 관계를끊고 테이블번호를 직접 저장 */
    public void disconnectTable(){
        if(this.dining != null){
            this.storedTableNo = this.dining.getTableNo(); /* dining의 테이블번호를 storedTableNo 입력*/
            this.dining = null; /* 주문과 다이닝의 관계해제 */
        }
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderNo='" + orderNo + '\'' +
                ", storedTableNo=" + storedTableNo +
                ", orderTime=" + orderTime +
                ", orderPayStatus='" + orderPayStatus + '\'' +
                ", orderAmount=" + orderAmount +
                ", orderVat=" + orderVat +
                '}';
    }
}
