package com.finalproject.possystem.table.entity;

import com.finalproject.possystem.order.entity.Order;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.*;


@ToString
@Setter
@Getter
@NoArgsConstructor
@Entity
public class Dining {
    @Id
    @Column(name="table_no")
    private Integer tableNo;
    private int x_position;
    private int y_position;
    private String table_color;


    public Dining(Integer tableNo, int x_position, int y_position, String table_color) {
        this.tableNo = tableNo;
        this.x_position = x_position;
        this.y_position = y_position;
        this.table_color = table_color;
    }
}
