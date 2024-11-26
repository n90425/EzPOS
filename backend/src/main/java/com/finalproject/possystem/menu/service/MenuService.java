package com.finalproject.possystem.menu.service;

import com.finalproject.possystem.menu.entity.Menu;
import com.finalproject.possystem.menu.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {
    @Autowired
    private MenuRepository menuRepository;

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

}
