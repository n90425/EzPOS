import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useCategories from "../../hooks/useCategory"; // Custom Hook 가져오기 (카테고리 가져오기)
import useItem from "../../hooks/useItem"; // Custom Hook 가져오기 (메뉴 가져오기)
import CategoryTabs from "../Category/CategoryTabs";
import MenuList from "../Category/MenuList";
import OrderList from "../Category/OrderList";
import OrderDetail from "./OrderDetail";
import "./order.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Order = () => {
  const { categories } = useCategories(); // Custom Hook 사용
  const { items, loading: itemLoading, error: itemError } = useItem(); // useItem 훅 사용
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리
  const [orderNo, setOrderNo] = useState(null); // 주문 번호
  const [orderDetails, setOrderDetails] = useState([]); // 주문 상세 데이터

  const { tableNo } = useParams(); // URL에서 테이블 번호 가져오기

  // 테이블 번호로 주문 생성 또는 조회
  useEffect(() => {
    const createOrGetOrder = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/order/${tableNo}`);
        setOrderNo(res.data);
        console.log("ORDER NO: ", res.data);
      } catch (error) {
        console.error("주문 생성 또는 조회 중 오류 발생: ", error);
      }
    };
    createOrGetOrder();
  }, [tableNo]);

  // 선택된 카테고리 초기값 설정
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0].categoryId); // 첫 번째 카테고리 선택
    }
  }, [categories]);


  // 주문 상세 데이터 가져오기
const fetchOrderDetails = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/order/${orderNo}/ordDetail`);
    setOrderDetails(res.data); // 서버에서 가져온 주문 상세 데이터를 상태로 저장
    console.log("Order Details: ", res.data);
  } catch (error) {
    console.error("주문 상세 데이터를 가져오는 중 오류 발생: ", error);
  }
};

// 주문 번호(orderNo)가 생성된 이후에 주문 상세 데이터를 가져오기
useEffect(() => {
  if (orderNo) {
    fetchOrderDetails();
  }
}, [orderNo]);


  // 메뉴를 선택하면 주문 상세 추가
  const addOrderDetail = async (menuId) => {
    if (!orderNo) {
      alert("주문을 먼저 생성하세요.");
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/order/${orderNo}/ordDetail`, {
        menuId,
        quantity: 1,
      });
      setOrderDetails((prev) => [...prev, res.data]);
      console.log("createOrderDetail: ", res.data);
    } catch (error) {
      console.error("주문 상세 추가 중 오류 발생: ", error);
    }
  };

  return (
    <div className="order-container">
      {/* 카테고리 탭 */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 메뉴 리스트 */}
      <MenuList
        menus={items.filter((menu) => menu.categoryId === selectedCategory)} // 선택된 카테고리에 따른 메뉴 필터링
        onAddToOrder={addOrderDetail}
      />

      {/* 주문 상세 */}
      <OrderDetail
        orders={orderDetails}
        removeFromOrder={(order) => {
          setOrderDetails(orderDetails.filter((item) => item !== order));
        }}
        totalAmount={orderDetails.reduce((acc, item) => acc + item.totalAmount, 0)}
      />
      {/* 하단 결제 버튼 */}
      <div className="order-footer">
        <button
          className="confirm-button"
          onClick={() => alert("결제 기능은 구현 중입니다.")}
        >
          결제
        </button>
      </div>

      {/* 로딩 및 에러 처리 */}
      {itemLoading && <p>Loading menu items...</p>}
      {itemError && <p>Error loading menu items: {itemError.message}</p>}
    </div>
  );
};

export default Order;
