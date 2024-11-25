package com.finalproject.possystem.category.controller;

import com.finalproject.possystem.category.entity.Category;
import com.finalproject.possystem.category.service.CategoryService;
import com.finalproject.possystem.table.entity.Dining;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CateController {
    @Autowired
    private CategoryService categoryService;

    /* 카테고리 최상위 목록 가져오기 */
    /* 부모가없는 null인것만 가져온다 */
    @GetMapping("/category")
    public List<Category> getcategory(){
        return categoryService.getAllMainCategory();
    }

    /* 새로운카테고리 post mapping */
    @PostMapping("/category")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        Category createdCategory  = categoryService.categoryInsert(category);
        return ResponseEntity.ok(createdCategory );
    }

//    // 특정 부모 ID의 자식 카테고리 반환
//    @GetMapping("/{parentId}/subcategories")
//    public List<Category> getSubCategories(@PathVariable Integer parentId) {
//        return categoryService.getSubCategoryByParent(parentId);
//    }

    @PostMapping("/deletecategory")
    public List<Category> categoryDelete(@RequestBody Map<String, Integer> requestData) {
        Integer category_id = requestData.get("category_id");
        categoryService.categoryDelete(category_id);
        System.out.println("category_id는 김뙈지" + category_id);
        return categoryService.getAllMainCategory();
    }

    @PostMapping("/updatecategory")
    public ResponseEntity<Category> updateCategory(@RequestBody Category category) {
        // 서비스 로직 호출
        Category updatedCategory = categoryService.categoryUpdate(category);

        // 업데이트된 카테고리가 없는 경우 (예: ID가 존재하지 않는 경우)
        if (updatedCategory == null) {
            return ResponseEntity.badRequest().build(); // 400 Bad Request 반환
        }
        // 성공적으로 업데이트된 경우
        return ResponseEntity.ok(updatedCategory);
    }
}
