package com.finalproject.possystem.category.repository;

import com.finalproject.possystem.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends CrudRepository<Category, Integer> {
    @Query("SELECT c FROM Category c WHERE c.categoryid2 IS NOT NULL AND c.isvisible = 'Y'")
    List<Category> findVisibleCategoriesWithSelfJoin();

//    @Repository
//    public interface CategoryRepository extends JpaRepository<Category, Integer> {
//        List<Category> findByParentCategoryIsNull();  // 대분류 조회
//        List<Category> findByParentCategory_Categoryid(Integer parentId);  // 특정 대분류에 속하는 중분류 조회
//    }

    List<Category> findCategoryByCategoryname(String category_name);

    List<Category> findByCategoryid2(Integer category_id2);


}
