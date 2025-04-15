package com.finalproject.possystem.table.controller;

import com.finalproject.possystem.menu.entity.Menu;
import com.finalproject.possystem.menu.repository.MenuRepository;
import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.entity.OrderDetail;
import com.finalproject.possystem.order.repository.OrderDetailRepository;
import com.finalproject.possystem.table.service.DiningService;
import com.finalproject.possystem.table.entity.Dining;
import com.finalproject.possystem.table.repository.DiningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DiningController {
    @Autowired
    private DiningService diningService;

    @Autowired
    private DiningRepository diningRepo;

    @Autowired
    private OrderDetailRepository orderDetailRepo;

    @Autowired
    private MenuRepository menuRepo;

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

    /* 테이블 전체를 가져와서 상태를 확인함 : 오더가 연결되어있느냐에따라 테이블색상이 달라짐 */
    @GetMapping("/status")
    public ResponseEntity<List<Dining>> getAlltables() {
        List<Dining> tables = diningService.getTable();
        return ResponseEntity.ok(tables);
    }

    /* 테이블 자리이동 구현: source 기존테이블을 target 변경테이블로 테이블 자리이동 */
    @PostMapping("/dining/move")
    public ResponseEntity<Map<String, String>> moveTable(@RequestBody Map<String, Integer> request){
        int sourceTableNo = request.get("sourceTableNo");
        int targetTableNo = request.get("targetTableNo");

        String msg = diningService.moveTable(sourceTableNo, targetTableNo);

        /* service 에있는 msg 를 가져오기위함 */
        Map<String, String> res = new HashMap<>();
        res.put("msg", msg);
        System.out.println("res: "+res);
        return ResponseEntity.ok(res);
    }

    /* 테이블 합산 구현 : source 기존테이블을 target 테이블과 합석 */
    @PostMapping("/dining/merge")
    public ResponseEntity<Map<String, String>> mergeTable(@RequestBody Map<String, Integer> request){
        int sourceTableNo = request.get("sourceTableNo");
        int targetTableNo = request.get("targetTableNo");

        String msg = diningService.mergeTable(sourceTableNo, targetTableNo);

        Map<String, String> res = new HashMap<>();
        res.put("msg", msg);
        System.out.println("Dining Merge res: "+res);
        return ResponseEntity.ok(res);
    }

    /* 특정 테이블번호에 연결된 주문및 주문상세 데이터를 반환 */
    @GetMapping("/dining/{tableNo}/details")
    public ResponseEntity<?> getTableOrderDetail(@PathVariable Integer tableNo) {
        Dining dining = diningRepo.findById(tableNo).orElse(null);
        System.out.println("dining============="+dining);

        if (dining == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("테이블을 찾을수없습니다.");
        }

        /* 테이블이 비어있는 상태일 경우 */
        if (dining.getStatus() == Dining.Status.EMPTY) {
            Map<String, Object> res = new HashMap<>();
            res.put("tableNo", dining.getTableNo());
            res.put("status", "EMPTY");
            res.put("message", "No order associated with this table");
            return ResponseEntity.ok(res);
        }

        /* 테이블이 주문과 연결된 경우 */
        Order order = dining.getCurrentOrder();
        List<OrderDetail> orderDetails = orderDetailRepo.findByOrderNo(order.getOrderNo());
        List<String> menuNames = orderDetails.stream()
                .map(detail -> {
                    // MenuRepo에서 menuId로 Menu를 조회하고 menuName을 반환
                    return menuRepo.findById(detail.getMenuId())
                            .map(Menu::getMenuName) // Menu가 존재하면 menuName 반환
                            .orElse("Unknown"); // Menu가 없으면 "Unknown" 반환
                })
                .toList();

        Map<String, Object> res = new HashMap<>();
        res.put("tableNo", dining.getTableNo());
        res.put("status", "OCCUPIED");
        res.put("orderDetails", orderDetails);
        res.put("menuNames", menuNames);

        return ResponseEntity.ok(res);
    }
}
