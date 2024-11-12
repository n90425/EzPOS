package com.finalproject.possystem.table.controller;

import com.finalproject.possystem.table.DiningService;
import com.finalproject.possystem.table.entity.Dining;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DiningController {
    @Autowired
    private DiningService diningService;

    @GetMapping("/dining")
    public List<Dining> getDining(){
        System.out.println(diningService.getTable());
        return diningService.getTable();
    }

    
    /* 사용자가 테이블 위치 편집후 저장 */
    @PostMapping("/saveDining")
    public List<Dining> saveDining(@RequestBody List<Dining> dining){
        return diningService.newTable(dining);
    }
}