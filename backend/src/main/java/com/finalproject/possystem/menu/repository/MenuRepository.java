package com.finalproject.possystem.menu.repository;

import com.finalproject.possystem.category.entity.Category;
import com.finalproject.possystem.menu.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Integer> {
    //menuId로 한개만 조회
    Menu findByMenuId(Integer menuId);

    //카테고리에 속한 메뉴 조회
    List<Menu> findByCategoryId(Integer categoryId);

    //메뉴이름으로 조회
    List<Menu> findMenuByMenuName(String menuName);

    // 카테고리에 속한 아이템 수를 반환
    int countByCategoryId(Integer categoryId);


    //토글 활성화만 조회
    List<Menu> findByIsVisible(boolean isVisible);

}
