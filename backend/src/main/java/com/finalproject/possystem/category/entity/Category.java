package com.finalproject.possystem.category.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Table(name= "category")
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    private String categoryname;

    private Character isvisible = 'Y';

    // 상위 카테고리와의 관계 설정
    @ManyToOne /* 이 필드를 실제로 사용할때 데이터를 로드 */
    @JoinColumn(name = "parent") /* 조인 컬럼*/
    @OnDelete(action = OnDeleteAction.CASCADE) /* 상위 카테고라기 삭제되면 자식 카테고리도 삭제*/
    @ToString.Exclude
    private Category parent;

    // 하위 카테고리와의 관계 설정
    @OneToMany(mappedBy = "parent",  cascade = CascadeType.ALL, fetch = FetchType.EAGER) // 카테고리 ID = 하위카테고리
    private List<Category> children = new ArrayList<>();


    public Category(String categoryname) {
        this.categoryname = categoryname;
    }



    @Override
    public String toString() {
        return "Category{" +
                "categoryId=" + categoryId +
                ", categoryname='" + categoryname + '\'' +
                ", isvisible=" + isvisible +
                ", parent=" + (parent != null ? parent.getCategoryId() : "null") +
                ", children=" + children +
                '}';
    }
}
