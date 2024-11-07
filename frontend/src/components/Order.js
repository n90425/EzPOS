import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function Order() {
  const { tableId } = useParams(); // URL에서 테이블 ID를 가져옴

  // 고기집 메뉴 데이터
  const menuItems = {
    고기: [
      { id: 1, name: '등심', price: 45000 },
      { id: 2, name: '생왕갈비', price: 40000 },
      { id: 3, name: '양념왕갈비', price: 38000 },
      { id: 4, name: '돼지갈비', price: 18000 },
      { id: 5, name: '삼겹살', price: 18000 }
    ],
    식사: [
      { id: 6, name: '갈비탕', price: 15000 },
      { id: 7, name: '제육볶음', price: 12000 },
      { id: 8, name: '물냉면', price: 10000},
      { id: 9, name: '비빔냉면', price: 10000},
      { id: 10, name: '김치찌개', price: 10000},
      { id: 11, name: '된장찌개', price: 8000},
      { id: 12, name: '고기된장', price: 2000},
      { id: 13, name: '공기밥', price: 2000},
    ],
    주류: [
      { id: 14, name: '소주', price: 5000 },
      { id: 15, name: '청하', price: 7000 },
      { id: 16, name: '맥주', price: 5000 },
      { id: 17, name: '음료', price: 2000 }
    ]
  };
  
    // 기본 카테고리를 '고기'로 설정
  const [activeCategory, setActiveCategory] = useState('고기');
  const [selectedItems, setSelectedItems] = useState([]);

  const handleOrder = (item) => {
    // 주문한 메뉴를 상태에 추가
    setSelectedItems((prev) => [...prev, item]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>테이블 {tableId} 메뉴</h1>

      {/* 카테고리 탭 */}
      <div style={{ marginBottom: '20px' }}>
        {Object.keys(menuItems).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: activeCategory === category ? '#007BFF' : '#f0f0f0',
              color: activeCategory === category ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 선택된 카테고리의 메뉴 표시 */}
      <h2>{activeCategory} 메뉴</h2>
      <ul>
        {menuItems[activeCategory].map((item) => (
          <li key={item.id}>
            {item.name}: {item.price.toLocaleString()}원
            <button
              style={{ marginLeft: '10px' }}
              onClick={() => handleOrder(item)}
            >
              주문하기
            </button>
          </li>
        ))}
      </ul>

      <h2>주문 목록</h2>
      {selectedItems.length === 0 ? (
        <p>주문한 메뉴가 없습니다.</p>
      ) : (
        <ul>
          {selectedItems.map((item, index) => (
            <li key={index}>
              {item.name}: {item.price.toLocaleString()}원
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Order;







//   // 예시 메뉴 데이터
//   const menuItems = [
//     { id: 1, name: '메뉴 1', price: 1000 },
//     { id: 2, name: '메뉴 2', price: 2000 },
//     { id: 3, name: '메뉴 3', price: 3000 },
//     { id: 4, name: '메뉴 4', price: 4000 },
//     { id: 5, name: '메뉴 5', price: 5000 }
//   ];

//   const [selectedItems, setSelectedItems] = useState([]);

//   const handleOrder = (item) => {
//     // 주문한 메뉴를 상태에 추가
//     setSelectedItems((prev) => [...prev, item]);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>테이블 {tableId} 메뉴</h1>
//       <h2>주문할 메뉴</h2>
//       <ul>
//         {menuItems.map((item) => (
//           <li key={item.id}>
//             {item.name}: {item.price}원
//             <button
//               style={{ marginLeft: '10px' }}
//               onClick={() => handleOrder(item)} // 주문하기 버튼 클릭 시
//             >
//               주문하기
//             </button>
//           </li>
//         ))}
//       </ul>
//       <h2>주문 목록</h2>
//       {selectedItems.length === 0 ? (
//         <p>주문한 메뉴가 없습니다.</p>
//       ) : (
//         <ul>
//           {selectedItems.map((item, index) => (
//             <li key={index}>
//               {item.name}: {item.price}원
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default Order;
