-- 날짜 포맷팅 20241028
select DATE_FORMAT(NOW(), '%Y%m%d') AS formated_date;
-- 날짜 포맷팅 뒤에 '-' 문자열 추가
select CONCAT(formated_date, '-') as con;

-- ------------------------------------- 위두개 합치기
select CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-') as formated_date;

-- 000001 일련번호 만들기
select LPAD('1','6','0') AS padded_order_no;

-- ------------------------------------- 위두개 합치기
select CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD('1','6','0')) AS padded_order_no;


set @num = 0;
select CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(@num := @num + 1,'6','0')) AS order_no
from `Order`
LIMIT 10;


--  Dining 가라데이터
INSERT INTO `Dining` (Table_no, x_position, y_position)
VALUES 
(1, 10, 20),
(2, 15, 25),
(3, 20, 30),
(4, 25, 35),
(5, 30, 40),
(6, 35, 45),
(7, 40, 50),
(8, 45, 55),
(9, 50, 60),
(10, 55, 65);

select * from Dining;
-- --------------------------------------------------------------------------------------------------------------------------------------------
-- Order 가라데이터
SET @num = -1;

INSERT INTO `Order` (order_no, table_no, order_time, order_pay_status, order_amount, order_vat)
VALUES 
(CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(@num := @num + 1, 6, '0')), 1, NOW(), 'pending', 100.00, 10.00),
(CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(@num := @num + 1, 6, '0')), 2, NOW(), 'pending', 200.00, 20.00),
(CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(@num := @num + 1, 6, '0')), 3, NOW(), 'completed', 150.00, 15.00),
(CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(@num := @num + 1, 6, '0')), 4, NOW(), 'pending', 120.00, 12.00),
(CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(@num := @num + 1, 6, '0')), 5, NOW(), 'completed', 180.00, 18.00),
(CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(@num := @num + 1, 6, '0')), 6, NOW(), 'pending', 220.00, 22.00),
(CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(@num := @num + 1, 6, '0')), 7, NOW(), 'completed', 140.00, 14.00),
(CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(@num := @num + 1, 6, '0')), 8, NOW(), 'pending', 160.00, 16.00),
(CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(@num := @num + 1, 6, '0')), 9, NOW(), 'completed', 130.00, 13.00),
(CONCAT(DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(@num := @num + 1, 6, '0')), 10, NOW(), 'pending', 250.00, 25.00);
select * from `Order`;
-- --------------------------------------------------------------------------------------------------------------------------------------------

-- OrderDetail 가라데이터
