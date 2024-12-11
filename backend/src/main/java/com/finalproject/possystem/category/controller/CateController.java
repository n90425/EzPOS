package com.finalproject.possystem.category.controller;

import com.finalproject.possystem.category.entity.Category;
import com.finalproject.possystem.category.service.CategoryService;
import com.finalproject.possystem.table.entity.Dining;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> categoryDelete(@RequestBody Map<String, Integer> requestData) {
        Integer categoryId = requestData.get("category_id");

        // 아이템 존재 여부 확인
        boolean hasItems = categoryService.hasItemsInCategory(categoryId);
        if (hasItems) {
            // HTTP 400 에러와 메시지 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "카테고리에 속한 아이템이 있습니다. 먼저 아이템을 삭제해주세요."));
        }

        // 카테고리 삭제 처리
        categoryService.categoryDelete(categoryId);

        // 성공적으로 삭제된 후 최신 카테고리 목록 반환
        List<Category> updatedCategories = categoryService.getAllCategories();
        return ResponseEntity.ok(updatedCategories);
    }



//    @PostMapping("/deletecategory")
//    public List<Category> categoryDelete(@RequestBody Map<String, Integer> requestData) {
//        Integer categoryId = requestData.get("category_id");
//
//        // 아이템 존재 여부 확인
//        boolean hasItems = categoryService.hasItemsInCategory(categoryId);
//        if (hasItems) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Map.of("message", "카테고리에 속한 아이템이 있습니다. 먼저 아이템을 삭제해주세요."));
//        }
//
//        // 카테고리 삭제 처리
//        categoryService.categoryDelete(categoryId);
//        return ResponseEntity.ok().build();
//    }

//    public ResponseEntity<?> deleteCategory(@RequestBody Map<String, Integer> payload) {



//    @PostMapping("/updatecategory")
//    public ResponseEntity<Category> updateCategory(@RequestBody Category category) {
//        // 서비스 로직 호출
//        Category updatedCategory = categoryService.categoryUpdate(category);
//
//        // 업데이트된 카테고리가 없는 경우 (예: ID가 존재하지 않는 경우)
//        if (updatedCategory == null) {
//            return ResponseEntity.badRequest().build(); // 400 Bad Request 반환
//        }
//        // 성공적으로 업데이트된 경우
//        return ResponseEntity.ok(updatedCategory);
//    }

    @PostMapping("/category/toggle-visibility")
    public ResponseEntity<?> toggleVisibility(@RequestBody Map<String, Object> payload) {
        System.out.println("Payload received: " + payload);

        Integer categoryId = (Integer) payload.get("categoryId");
        Boolean isVisible = (Boolean) payload.get("isVisible");

        categoryService.updateCategoryVisibility(categoryId, isVisible);
        return ResponseEntity.ok().build();
    }


}
