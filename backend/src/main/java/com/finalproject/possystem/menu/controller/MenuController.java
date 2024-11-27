package com.finalproject.possystem.menu.controller;

import com.finalproject.possystem.menu.entity.Menu;
import com.finalproject.possystem.menu.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MenuController {
    @Autowired
    private MenuService menuService;

    //모든 menu 조회
    @GetMapping("/menu")
    public List<Menu> getmenu() {
        return menuService.getMenuBy();
    }


    //메뉴 저장
    @PostMapping("/menu")
    public Menu addMenu(@RequestBody Menu menu) {
        // categoryId가 없으면 예외 처리
        if (menu.getCategoryId() == null) {
            throw new IllegalArgumentException("카테고리 정보가 필요합니다.");
        }

        // 메뉴 저장
        return menuService.menuInsert(menu);
    }




    //menu삭제
    @PostMapping("/deletemenu")
    public List<Menu> menuDelete(@RequestBody Map<String, Integer> requestData) {
        Integer menuId = requestData.get("menuId");
        menuService.menuDelete(menuId);
        return menuService.getMenuBy();
    }
}
