package com.finalproject.possystem.table.entity;

import com.finalproject.possystem.order.entity.Order;
import jakarta.persistence.*;
import lombok.*;


@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="dining")
@Entity
public class Dining {
    @Id
    @Column(name="`tableNo`")
    private Integer tableNo;
    @Column(name = "xPosition")
    private int xPosition;
    @Column(name = "yPosition")
    private int yPosition;
    @Column(name = "tableColor")
    private String tableColor;
}
