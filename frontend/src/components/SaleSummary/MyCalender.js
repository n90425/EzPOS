import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendarWithEvents() {
  const [date, setDate] = useState(new Date());
  const events = {
    "2024-11-26": ["회의", "코드 리뷰"],
    "2024-11-28": ["팀 미팅", "프로젝트 마감"],
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = formatDate(date);
      return events[formattedDate] ? (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12px' }}>
          {events[formattedDate].map((event, idx) => (
            <li key={idx}>{event}</li>
          ))}
        </ul>
      ) : null;
    }
  };

  return (
    <div>
      <h1>React Calendar with Events</h1>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent} // 날짜마다 커스터마이징된 콘텐츠 추가
      />
      <p>선택한 날짜: {date.toDateString()}</p>
    </div>
  );
}

export default MyCalendarWithEvents;
