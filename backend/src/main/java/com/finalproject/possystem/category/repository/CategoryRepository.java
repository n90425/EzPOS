package com.finalproject.possystem.category.repository;

import com.finalproject.possystem.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository  {
    //categoryId로 category엔티티 조회
    Category findByCategoryId(Integer categoryId);

    //categoryname으로 category엔티티 리스트 조회
    List<Category> findCategoryByCategoryname(String categoryname);

    //부모 category로 자식category리스트 조회
    List<Category> findByParent(Category parent);

    // 대분류만 조회
    List<Category> findByParentIsNull();
}
