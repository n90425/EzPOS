package com.finalproject.possystem.table.service;

import com.finalproject.possystem.order.entity.Order;
import com.finalproject.possystem.order.entity.OrderDetail;
import com.finalproject.possystem.order.repository.OrderDetailRepository;
import com.finalproject.possystem.order.repository.OrderRepository;
import com.finalproject.possystem.table.entity.Dining;
import com.finalproject.possystem.table.repository.DiningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class DiningService {
    @Autowired
    private DiningRepository diningRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderDetailRepository orderDetailRepo;

    /* 전체의 테이블개수 세기 */
    public long count(){
        return diningRepo.count();
    }

    /* 전체 테이블을 가져오는 메서드 */
    public List<Dining> getTable(){
        return diningRepo.findAll();
    }

    /* 하나의 테이블을 가져오는 메서드 */
    public Dining findDiningByTableNo(Integer tableNo){
        Dining dining = diningRepo.findByTableNo(tableNo);
        if(dining==null){
            throw new IllegalArgumentException("해당 테이블번호를 찾을수 없습니다.: "+ tableNo);
        }
        return dining;
    }



    /* 테이블을 생성하는 메서드 */
    public Dining saveTable(Dining dining) {
        System.out.println("Saving table: " + dining);

        Dining existingDining = diningRepo.findById(dining.getTableNo()).orElse(null);

        if (existingDining != null) {
            System.out.println("Existing dining found: " + existingDining);
            existingDining.setTableColor(dining.getTableColor());
            existingDining.setxPosition(dining.getxPosition());
            existingDining.setyPosition(dining.getyPosition());
            existingDining.setWidth(dining.getWidth());
            existingDining.setHeight(dining.getHeight());
            return diningRepo.save(existingDining);
        } else {
            return diningRepo.save(dining);
        }
    }

    public List<Dining> saveTableAll(List<Dining> diningList) {
        for (Dining dining : diningList) {
            Dining existingDining = diningRepo.findById(dining.getTableNo()).orElse(null);

            if (existingDining != null) {
                // 기존 엔터티가 있으면 업데이트
                existingDining.setTableColor(dining.getTableColor());
                existingDining.setxPosition(dining.getxPosition());
                existingDining.setyPosition(dining.getyPosition());
                existingDining.setWidth(dining.getWidth());
                existingDining.setHeight(dining.getHeight());
                diningRepo.save(existingDining);
            } else {
                // 기존 엔터티가 없으면 새로 저장
                diningRepo.save(dining);
            }
        }
        return diningRepo.findAll(); // 모든 테이블 반환
    }

    /* 하나의 테이블을 삭제 */
    @Transactional
    public void delTable(Integer tableNo){
        Dining dining = diningRepo.findById(tableNo)
                .orElseThrow(() -> new IllegalArgumentException("테이블을 찾을 수 없습니다."));

        // 관련된 Order의 dining 참조 해제
        List<Order> orders = orderRepo.findByDining(dining);
        for (Order order : orders) {
            order.setDining(null);
            orderRepo.save(order);
        }

        // Dining 삭제
        diningRepo.delete(dining);
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

    /* 선택한 테이블에 orderNo가 null인경우 -> 상태를 empty 로 설정하고 currentOrderNo를 null로 설정 */
    /* null이 아닌경우 -> 상태를 OCCUPIED로 설정하고 currentOrder를 order 객체로 변경 */
    public void updateDiningCurrentOrder(Integer tableNo, String orderNo) {
        Dining dining = diningRepo.findById(tableNo)
                .orElseThrow(() -> new RuntimeException("Dining not fount"));

        /* 선택된 테이블에 연결된 orderNo가 null인경우 */
        if(orderNo == null){
            dining.setStatus(Dining.Status.EMPTY);
            dining.setCurrentOrder(null);
        } else {
            Order order = orderRepo.findByOrderNo(orderNo);
            if(order == null){
                throw new RuntimeException("orderNo를 찾을수 없습니다: "+ orderNo);
            }
            dining.setStatus(Dining.Status.OCCUPIED);
            dining.setCurrentOrder(order);
        }
        diningRepo.save(dining);
    }


    /* 주문의 결제상태에 따라 Table의 사용여부용여부를 EMPTY:비어있음 로 바꾸고 저장 */
    public void updateTableStatus(Integer tableNo, Order order, boolean isPaid){
        Dining table = diningRepo.findById(tableNo)
                .orElseThrow(() -> new RuntimeException("해당 테이블번호를 찾을수 없습니다."));

        if (isPaid) {
            table.freeTable(); /* 결제완료 : 현재상태를 EMPTY 로 변경 */
        } else {
            table.occupyTable(order); /* 주문생성 : 현재상태를 OCCUPIED로 변경 */
        }
        diningRepo.save(table);
    }

    /* 테이블 자리이동 구현 */
    @Transactional
    public String moveTable(int sourceTableNo, int targetTableNo) {
        /* 선택된테이블 찾기 */
        Dining sourceTable = diningRepo.findById(sourceTableNo)
                .orElseThrow(()-> new IllegalArgumentException("기존테이블을 찾을수 없습니다"));
        /* 대상테이블 찾기 */
        Dining targetTable = diningRepo.findById(targetTableNo)
                .orElseThrow(()-> new IllegalArgumentException("대상테이블을 찾을수 없습니다"));

        /* 선택된테이블인지 EMPTY 일경우 throw 발생 */
        if(sourceTable.getStatus() == Dining.Status.EMPTY) {
            throw new IllegalArgumentException("테이블이 비어있습니다");
        }

        /* 대상테이블이 EMPTY가 아닐경우 throw발생 */
        if(targetTable.getStatus() != Dining.Status.EMPTY) {
            throw new IllegalArgumentException("테이블이 비어있지않습니다");
        }

        /* 테이블의 현재 연결된 Order객체를 가져온다 */
        Order currentOrder = sourceTable.getCurrentOrder();
        System.out.println("currentOrder: "+currentOrder);
        if(currentOrder == null) {
            throw new IllegalArgumentException("원본테이블에 연결된 주문이 없습니다");
        }

        /* 대상테이블에 주문연결 및 상태변경 */
        targetTable.setCurrentOrder(currentOrder);
        targetTable.setStatus(Dining.Status.OCCUPIED);

        /* 원본테이블 초기화 */
        sourceTable.setCurrentOrder(null);
        sourceTable.setStatus(Dining.Status.EMPTY);

        /* 테이블저장 */
        diningRepo.save(sourceTable);
        diningRepo.save(targetTable);

        /* 주문 DB 정보 업데이트 */
        String orderNo = currentOrder.getOrderNo();
        Order order = orderRepo.findByOrderNo(orderNo);
        if (order == null) {
            throw new IllegalArgumentException("해당 주문을 찾을 수 없습니다.");
        }
        order.setDining(targetTable);
        orderRepo.save(order);

        return String.format("테이블 %d번이 %d번으로 이동되었습니다.", sourceTableNo, targetTableNo);
    }

    /* 주문상세 삭제후 주문삭제 */
    @Transactional
    public void deleteOrder(String orderNo){
        orderDetailRepo.deleteByOrderNo(orderNo);
        orderRepo.deleteById(orderNo);
    }

    /* 테이블 합석 구현 */
    @Transactional
    public String mergeTable(int sourceTableNo, int targetTableNo){
        /* 원본테이블 찾기 */
        Dining sourceTable = diningRepo.findById(sourceTableNo)
                .orElseThrow(() -> new IllegalArgumentException("기존테이블을 찾을수 없습니다."));
        /* 대상테이블 찾기 */
        Dining targetTable = diningRepo.findById(targetTableNo)
                .orElseThrow(() -> new IllegalArgumentException("대상테이블을 찾을수 없습니다"));
        /* 원본테이블과 대상테이블이 EMPTY 일경우 throw 발생 */
        if(sourceTable.getStatus() == Dining.Status.EMPTY ){
            throw new IllegalArgumentException("원본 테이블이 비어있습니다");
        }

        if(targetTable.getStatus() == Dining.Status.EMPTY){
            throw new IllegalArgumentException("대상 테이블이 비어있습니다");
        }

        /* 원본테이블의 연결된 order 객체 가져오기 */
        Order sourceOrder = sourceTable.getCurrentOrder();
        if(sourceOrder == null){
            throw new IllegalArgumentException("원본테이블에 연결된 주문이 없습니다");
        }
        /* 대상테이블의 연결된 order 객체 가져오기 */
        Order targetOrder = targetTable.getCurrentOrder();
        if(targetOrder == null){
            throw new IllegalArgumentException("대상테이블에 연결된 주문이 없습니다");
        }

        /* 주문병합 */
        for (OrderDetail sourceDetail : sourceOrder.getOrderDetails()){
            /* 대상테이블에 원본테이블의 메뉴과 같은게 있는지 확인 */
            Optional<OrderDetail> existingDetail = targetOrder.getOrderDetails().stream()
                    .filter(detail -> detail.getMenuId().equals(sourceDetail.getMenuId()))
                    .findFirst();

            if(existingDetail.isPresent()){
                /* 동일한메뉴가 있을경우 수량을 합산 */
                existingDetail.get().setQuantity(existingDetail.get().getQuantity()+sourceDetail.getQuantity());
            } else {
                /* 동일한메뉴가 없을경우 추가 */
                OrderDetail newDetail = new OrderDetail();
                newDetail.setMenuId(sourceDetail.getMenuId());
                newDetail.setQuantity(sourceDetail.getQuantity());
                newDetail.setUnitPrice(sourceDetail.getUnitPrice());
                newDetail.setMenuName(sourceDetail.getMenuName());
                newDetail.setStatus(sourceDetail.getStatus());
                newDetail.setOrder(targetOrder);
                /* orderAddNo의 최대값을 가져온다 */
                int maxOrdAddNo = orderDetailRepo.findMaxOrdAddByOrderNo(targetOrder.getOrderNo()).orElse(0);
                /* ordAddNo 1씩 증가 */
                newDetail.setOrdAddNo(maxOrdAddNo+1);
                targetOrder.getOrderDetails().add(newDetail);
            }
        }

        /* 금액 합산 */
        targetOrder.setOrderAmount(sourceOrder.getOrderAmount()+targetOrder.getOrderAmount());

        /* 선택테이블을 초기화 (orderNo 와 dinng 상태) */
        sourceTable.setCurrentOrder(null);
        sourceTable.setStatus(Dining.Status.EMPTY);

        /* 원본 주문 삭제 */
        sourceOrder.getOrderDetails().forEach(detail -> {
            if (detail.getOrder() == null) {
                throw new RuntimeException("OrderDetail에 Order가 설정되지 않았습니다.");
            }
            detail.setOrder(null); // Order와의 관계 해제
            orderDetailRepo.delete(detail); // OrderDetail 개별 삭제
        });
        sourceOrder.getOrderDetails().clear(); // OrderDetails 리스트 초기화
        orderRepo.delete(sourceOrder);

        /* 테이블 저장 */
        orderRepo.save(targetOrder);
        diningRepo.save(targetTable);





        return String.format("테이블 %d번이 %d번으로 합석이 완료 되었습니다.", sourceTableNo, targetTableNo);
    }
}
