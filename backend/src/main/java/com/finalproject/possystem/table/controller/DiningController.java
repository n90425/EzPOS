package com.finalproject.possystem.table.controller;

import com.finalproject.possystem.table.service.DiningService;
import com.finalproject.possystem.table.entity.Dining;
import com.finalproject.possystem.table.repository.DiningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DiningController {
    @Autowired
    private DiningService diningService;

    @Autowired
    private DiningRepository diningRepo;

    @GetMapping("/dining")
    public List<Dining> getDining(){
        return diningService.getTable();
    }

    
    /* 사용자가 테이블 위치 편집후 저장 */
    @PostMapping("/saveDining")
    public Dining saveDining(@RequestBody Dining dining){
        return diningService.saveTable(dining);
    }

    @PostMapping("/saveDiningAll")
    public List<Dining> saveDiningAll(@RequestBody List<Dining> dining){
        return diningService.saveTableAll(dining);
    }

    /* DB에 비어있는 테이블 찾기 */
    @GetMapping("/nextTableNo")
    public Integer getNextTableNo(){
        return diningService.findNextTableNo();
    }


    /* 사용자가 테이블 삭제후 반환 */
    @PostMapping("/deleteDining")
    public List<Dining> deleteDining(@RequestBody Map<String, Integer> requestData) {
        Integer tableNo = requestData.get("tableNo");
        diningService.delTable(tableNo);
        return diningService.getTable();
    }

    /* 테이블 전체를 가져와서 상태를 확인함 */
    @GetMapping("/status")
    public ResponseEntity<List<Dining>> getAlltables() {
        List<Dining> tables = diningService.getTable();
        return ResponseEntity.ok(tables);
    }
}
