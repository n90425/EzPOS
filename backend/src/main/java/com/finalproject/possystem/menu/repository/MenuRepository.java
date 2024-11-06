package com.finalproject.possystem.menu.repository;

import com.finalproject.possystem.category.entity.Category;
import com.finalproject.possystem.menu.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Integer> {

    Menu findByMenuId(Integer menuId);

    List<Menu> findMenuByMenuName(String menuName);


}
