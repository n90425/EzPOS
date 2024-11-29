package com.finalproject.possystem.menu.entity;

import com.finalproject.possystem.category.entity.Category;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Table(name = "menu")
@Entity
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menuId")
    private Integer menuId;

    @Column(name = "category_id", nullable = false)
    private Integer categoryId;  // 카테고리 ID (FK)

    @Column(name = "menuName")
    private String menuName;

    @Column(name = "menuPrice")
    private Integer menuPrice;

    @Column(name = "menuDescription")
    private String menuDescription;

    @Column(name = "menuImage")
    private String menuImage;

    @Column(name = "isVisible")
    private Boolean  isVisible;

    @Column(name = "menuDate")
    private Date menuDate;

    // 카테고리와의 관계 설정
    @ManyToOne
    @JoinColumn(name = "category_id", insertable = false, updatable = false)  // 카테고리 ID 조인
    private Category category;  // Category 엔티티와 연결


}
