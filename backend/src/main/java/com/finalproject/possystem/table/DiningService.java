package com.finalproject.possystem.table;

import com.finalproject.possystem.table.entity.Dining;
import com.finalproject.possystem.table.repository.DiningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class DiningService {
    @Autowired
    private DiningRepository diningRepo;

    /* 전체의 테이블개수 세기 */
    public long count(){
        return diningRepo.count();
    }

    /* 전체 테이블을 가져오는 메서드 */
    public List<Dining> getTable(){
        return diningRepo.findAll();
    }

    /* 하나의 테이블을 가져오는 메서드 */
    public Dining getTable(Integer tableNo){
        return diningRepo.findById(tableNo).orElse(null);
    }

    /* 테이블을 생성하는 메서드 */
    public Dining saveTable(Dining dining){
        return diningRepo.save(dining);
    }

    public List<Dining> saveTableAll(List<Dining> dining) {
        return diningRepo.saveAll(dining);
    }

    /* 하나의 테이블을 삭제 */
    public void delTable(Integer tableNo){
        if (tableNo != null) {
            diningRepo.deleteById(tableNo);
        } else {
            throw new IllegalArgumentException("Table number must not be null");
        }
    }

    /* DB에 비어있는 테이블 찾기 */
    public Integer findNextTableNo(){
        List<Integer> tableNos = diningRepo.findAllTableNo();
        Collections.sort(tableNos); // 테이블번호 정렬

        int nextno = 1; /* 1번부터 시작 */
        for(Integer tableNo : tableNos) {
            if(tableNo != nextno){
                break; /* 비어있는 번호를 찾으면 종료 */
            }
            nextno++;
        }
        return nextno;
    }

    /* table 수정할경우 테이블색상과 위치 변경하는 update문 실행 */
    public Dining updateTable(Dining table){
        Dining dining = diningRepo.findById(table.getTableNo()).orElse(null);

        if(dining == null) return null;

        dining.setTableColor(table.getTableColor());
        dining.setyPosition(table.getxPosition());
        dining.setyPosition(table.getyPosition());
        return diningRepo.save(dining);
    }


}
