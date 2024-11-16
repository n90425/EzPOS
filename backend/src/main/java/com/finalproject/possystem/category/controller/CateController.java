package com.finalproject.possystem.category.controller;

import com.finalproject.possystem.category.entity.Category;
import com.finalproject.possystem.category.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CateController {
    @Autowired
    private CategoryService categoryService;

    /* 카테고리 최상위 목록 가져오기 */
    /* 부모가없는 null인것만 가져온다 */
    @GetMapping("/category")
    public List<Category> getcategory(){
        System.out.println(categoryService.getAllMainCategory());
        return categoryService.getAllMainCategory();
    }

    /* 새로운카테고리 post mapping 만드세용 */

}
