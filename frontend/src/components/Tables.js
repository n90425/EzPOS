import React from 'react';
import { Link } from 'react-router-dom';

function Tables() {
  const tableCount = 20; // 테이블 수

  return (
    <div>
      <h1>테이블 목록</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {Array.from({ length: tableCount }).map((_, index) => (
          <Link to={`/table/${index + 1}`} key={index}>
            <button> {index + 1}테이블</button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Tables;
