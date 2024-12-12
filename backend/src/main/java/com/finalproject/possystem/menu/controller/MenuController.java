package com.finalproject.possystem.menu.controller;

import com.finalproject.possystem.category.entity.Category;
import com.finalproject.possystem.menu.entity.Menu;
import com.finalproject.possystem.menu.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    //메뉴수정
    @PostMapping("/updatemenu")
    public ResponseEntity<Menu> updateMenu(@RequestBody Menu menu) {
        Menu updateMenu = menuService.menuUpdate(menu);

        // 업데이트된 카테고리가 없는 경우 (예: ID가 존재하지 않는 경우)
        if (updateMenu == null) {
            return ResponseEntity.badRequest().build();
        }
        // 성공적으로 업데이트된 경우
        return ResponseEntity.ok(updateMenu);
    }

    @PostMapping("/menu/toggle-visibility")
    public ResponseEntity<?> toggleMenuVisibility(@RequestBody Map<String, Object> payload) {
        Integer menuId = (Integer) payload.get("menuId");
        Boolean isVisible = (Boolean) payload.get("isVisible");

        menuService.updatemenuVisibility(menuId, isVisible);

        System.out.println("menuId: " + menuId + ", isVisible: " + isVisible);

        return ResponseEntity.ok().build();
    }


    //활성화 된 카테고리만 가져오기
    @GetMapping("/menu/visibility")
    public ResponseEntity<List<Menu>> getVisibleCategories() {
        List<Menu> menus = menuService.getVisibleCategories();
        return ResponseEntity.ok(menus);
    }



    //menu삭제
    @PostMapping("/deletemenu")
    public List<Menu> menuDelete(@RequestBody Map<String, Integer> requestData) {
        Integer menuId = requestData.get("menuId");

        if (menuId == null) {
            System.err.println("menuId is null");
            throw new IllegalArgumentException("menuId cannot be null");
        }

        System.out.println("menuId11: " + menuId);

        menuService.menuDelete(menuId);

        return menuService.getMenuBy();
    }

}
