CREATE TABLE `Category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_id2` int DEFAULT NULL,
  `category_name` varchar(20) NOT NULL,
  `is_visible` char(1) NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`category_id`),
  KEY `fk_category_self` (`category_id2`),
  CONSTRAINT `fk_category_self` FOREIGN KEY (`category_id2`) REFERENCES `Category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `Dining` (
  `Table_no` int NOT NULL,
  `x_position` int NOT NULL,
  `y_position` int NOT NULL,
  `table_color` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Table_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `Menu` (
  `menu_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `menu_name` varchar(30) NOT NULL,
  `menu_price` int NOT NULL,
  `menu_description` varchar(300) NOT NULL,
  `menu_image` varchar(500) NOT NULL,
  `is_visible` char(1) NOT NULL DEFAULT 'Y',
  `menu_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`menu_id`),
  KEY `fk_category_id` (`category_id`),
  CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `Category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `Menu_status` (
  `menu_status_num` int NOT NULL,
  `menu_id` int NOT NULL,
  `menu_status` varchar(10) DEFAULT NULL,
  `menu_start_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `menu_end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`menu_status_num`,`menu_id`),
  KEY `fk_menu_id` (`menu_id`),
  CONSTRAINT `fk_menu_id` FOREIGN KEY (`menu_id`) REFERENCES `Menu` (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `Order` (
  `order_no` varchar(13) NOT NULL,
  `table_no` int NOT NULL,
  `order_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `order_pay_status` varchar(20) NOT NULL,
  `order_amount` decimal(10,2) NOT NULL,
  `order_vat` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_no`),
  KEY `fk_table_no` (`table_no`),
  CONSTRAINT `fk_table_no` FOREIGN KEY (`table_no`) REFERENCES `Dining` (`Table_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `Order_detail` (
  `ord_detail_no` int NOT NULL AUTO_INCREMENT,
  `order_no` varchar(13) NOT NULL,
  `menu_id` int NOT NULL,
  `ord_add_no` varchar(4) NOT NULL,
  `unit_price` int NOT NULL,
  `quantity` int NOT NULL,
  `total_amount` int NOT NULL,
  `item_order_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ord_detail_no`),
  UNIQUE KEY `ord_detail_no` (`ord_detail_no`,`order_no`),
  KEY `fk_order_no` (`order_no`),
  KEY `fk_order_detail_menu_id` (`menu_id`),
  CONSTRAINT `fk_order_detail_menu_id` FOREIGN KEY (`menu_id`) REFERENCES `Menu` (`menu_id`),
  CONSTRAINT `fk_order_no` FOREIGN KEY (`order_no`) REFERENCES `Order` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `Pay` (
  `pay_no` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `pay_seqnum` int NOT NULL,
  `order_no` varchar(13) NOT NULL,
  `od_pay_amt` int NOT NULL,
  `pay_stat_cd` varchar(20) NOT NULL,
  `pay_dt` datetime NOT NULL,
  `pay_meth_cd` varchar(10) DEFAULT NULL,
  `pay_aprv_cd` varchar(20) DEFAULT NULL,
  `pay_aprv_num` varchar(10) DEFAULT NULL,
  `pay_aprv_dt` datetime DEFAULT NULL,
  `pay_resp_cd` varchar(10) DEFAULT NULL,
  `pay_canc_amt` int DEFAULT NULL,
  `pay_canc_dt` datetime DEFAULT NULL,
  `trans_type` varchar(20) NOT NULL,
  `card_co` varchar(20) DEFAULT NULL,
  `mth_instlmt` int DEFAULT NULL,
  `card_num` varchar(20) DEFAULT NULL,
  `bank_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`pay_no`,`pay_seqnum`),
  KEY `fk_order_no_pay` (`order_no`),
  CONSTRAINT `fk_order_no_pay` FOREIGN KEY (`order_no`) REFERENCES `Order` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

