package com.finalproject.possystem.websocket.dto;

import java.util.List;

/**
 KitchenOrderDto
 ├── orderNo: 주문 번호
 ├── tableNo: 테이블 번호
 └── items: List<KitchenOrderItemDto>
             ├── menuName: 메뉴명
             ├── quantity: 수량
             └── status: 주문 상태 (NORMAL, CANCELED, COMPLETED)
 * @since 2025-04-30
 */
public class KitchenOrderDto {
    private String orderNo;
    private int tableNo;
    private List<KitchenOrderItemDto> items;

    public KitchenOrderDto(String orderNo, int tableNo, List<KitchenOrderItemDto> items) {
        this.orderNo = orderNo;
        this.tableNo = tableNo;
        this.items = items;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public int getTableNo() {
        return tableNo;
    }

    public void setTableNo(int tableNo) {
        this.tableNo = tableNo;
    }

    public List<KitchenOrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<KitchenOrderItemDto> items) {
        this.items = items;
    }
}
