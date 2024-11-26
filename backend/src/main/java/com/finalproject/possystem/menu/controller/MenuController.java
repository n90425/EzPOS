package com.finalproject.possystem.menu.controller;

import com.finalproject.possystem.menu.entity.Menu;
import com.finalproject.possystem.menu.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
