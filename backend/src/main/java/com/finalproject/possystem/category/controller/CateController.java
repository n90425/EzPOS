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
        System.out.println("category_id"+category_id);
        return categoryService.getAllMainCategory();
    }

}
