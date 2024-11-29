package com.finalproject.possystem.menu.service;

import com.finalproject.possystem.category.entity.Category;
import com.finalproject.possystem.category.repository.CategoryRepository;
import com.finalproject.possystem.menu.entity.Menu;
import com.finalproject.possystem.menu.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {
    @Autowired
    private MenuRepository menuRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    //menuId로 조회
    public Menu getMenuById(Integer menuId) {
        return menuRepository.findByMenuId(menuId);
    }

    public List<Menu> getMenuBy() {
        return menuRepository.findAll();
    }

    //카테고리에 속한 메뉴 조회
    public List<Menu> getMenuByCategory(Integer categoryId) {
        return menuRepository.findByCategoryId(categoryId);
    }

    //카테고리에 메뉴 추가
    public Menu menuInsert(Menu menu) {
        // categoryId가 없으면 예외 처리
        if (menu.getCategoryId() == null) {
            throw new IllegalArgumentException("카테고리 ID가 필요합니다.");
        }

        // Category 엔티티와의 연관 관계를 설정
        Category category = new Category();
        category.setCategoryId(menu.getCategoryId());
        menu.setCategory(category); // Menu 엔티티에 Category 객체 설정

        return menuRepository.save(menu);
    }

    //메뉴 업데이트
    public Menu menuUpdate(Menu menu) {
        Menu menuupdate = menuRepository.findByMenuId(menu.getMenuId());
        if (menuupdate == null) return null;
        menuupdate.setCategoryId(menu.getCategoryId());
        menuupdate.setMenuName(menu.getMenuName());
        menuupdate.setMenuPrice(menu.getMenuPrice());
        menuupdate.setIsVisible(menu.getIsVisible());
        return menuRepository.save(menuupdate);
    }

    //visible사용 여부
    public void updatemenuVisibility(Integer menuId, Boolean isVisible){
        Menu menu = menuRepository.findByMenuId(menuId);
        if (menu == null) {
            throw new IllegalArgumentException("Menu not found");
        }
        menu.setIsVisible(isVisible);
        menuRepository.save(menu);
    }

    //menuId로 삭제
    public void menuDelete(Integer menuId) { menuRepository.deleteById(menuId);}

}
