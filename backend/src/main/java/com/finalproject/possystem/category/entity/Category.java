package com.finalproject.possystem.category.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "`category`")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryid;

    @Column(name = "category_id2", insertable = false, updatable = false)
    private Integer categoryid2; // 부모 카테고리 ID (null일 경우 상위 카테고리)

    @Column(name = "category_name")
    private String categoryname;

    @Column(name = "is_visible")
    private char isvisible;

    // 상위 카테고리와의 관계 설정
    @ManyToOne
    @JoinColumn(name = "category_id2") // 상위 카테고리 참조
    private Category parent;

    // 하위 카테고리와의 관계 설정
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true) // 하위 카테고리
    private List<Category> subCategories = new ArrayList<>();

    public Category(Integer categoryid, Integer categoryid2, String categoryname, char isvisible) {
        this.categoryid = categoryid;
        this.categoryid2 = categoryid2;
        this.categoryname = categoryname;
        this.isvisible = isvisible;
    }
}
