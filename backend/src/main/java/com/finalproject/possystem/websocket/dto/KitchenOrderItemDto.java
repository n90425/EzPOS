package com.finalproject.possystem.websocket.dto;

import lombok.ToString;

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

@ToString
public class KitchenOrderItemDto {
    private String menuName;
    private int quantity;
    private OrderDetailStatus status;

    public KitchenOrderItemDto(String menuName, int quantity, OrderDetailStatus status) {
        this.menuName = menuName;
        this.quantity = quantity;
        this.status = status;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public OrderDetailStatus getStatus() {
        return status;
    }

    public void setStatus(OrderDetailStatus status) {
        this.status = status;
    }
}
