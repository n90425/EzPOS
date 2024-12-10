create table category
(
    category_id  int auto_increment primary key,
    isvisible    tinyint(1) default 0 null,
    parent       int                  null,
    categoryname varchar(255)         null,
    constraint FKcmtwvovxcdalvlgifxh6luun8
        foreign key (parent) references category (category_id)
            on delete cascade
);

create table dining
(
    tableNo        int       primary key  					  not null,
    xPosition      decimal(10, 2)                             not null,
    yPosition      decimal(10, 2)                             not null,
    tableColor     varchar(20)                                null,
    width          decimal(10, 2)                             not null,
    height         decimal(10, 2)                             not null,
    status         enum ('EMPTY', 'OCCUPIED') default 'EMPTY' null,
    currentOrderNo varchar(255)                               null
);

create table menu
(
    menuId          int auto_increment	 primary key,
    category_id     int                  not null,
    menuName        varchar(30)          not null,
    menuPrice       int                  not null,
    menuDescription varchar(300)         null,
    menuImage       varchar(500)         null,
    isVisible       tinyint(1) default 0 null,
    menuDate        date                 null,
    constraint FKww84tou7nixng06lmxawvcre
        foreign key (category_id) references category (category_id)
);

create table menu_status
(
    menuStatusNum int                                not null,
    menuId        int                                not null,
    menuStatus    varchar(10)                        null,
    menuStartDate datetime default CURRENT_TIMESTAMP null,
    menuEndDate   datetime                           null,
    primary key (menuStatusNum, menuId),
    constraint fk_menu_id
        foreign key (menuId) references menu (menuId)
);

create table `order`
(
    orderNo        varchar(255)                       not null primary key,
    tableNo        int                                null,
    storedTableNo  int                                null,
    orderTime      datetime default CURRENT_TIMESTAMP not null,
    orderPayStatus varchar(255)                       null,
    orderAmount    double                             null,
    orderVat       double                             null,
    constraint fk_tableNo
        foreign key (tableNo) references dining (tableNo)
            on delete set null
);

alter table dining
    add constraint dining___fk
        foreign key (currentOrderNo) references `order` (orderNo);

create table order_detail
(
    ordDetailNo   int auto_increment
        primary key,
    orderNo       varchar(255)                       not null,
    menuId        int                                not null,
    ordAddNo      int                                not null,
    unitPrice     int                                not null,
    quantity      int      default 1                 not null,
    totalAmount   int AS (unitPrice * quantity) stored,
    itemOrderTime datetime default CURRENT_TIMESTAMP not null,
    constraint ord_detail_no
        unique (ordDetailNo, orderNo),
    constraint fk_orderNo
        foreign key (orderNo) references `order` (orderNo),
    constraint fk_order_detail_menu_id
        foreign key (menuId) references menu (menuId)
);

create index fk_order_detail_menuId
    on order_detail (menuId);

create index fk_order_no
    on order_detail (orderNo);

create table order_sequence
(
    openDate        timestamp     not null
        primary key,
    isOpen          tinyint(1)    not null,
    currentSequence int default 0 not null,
    totalOrders     int default 0 null,
    totalSales      int default 0 null
);

create table pay
(
    payNo               binary(16)                      default (uuid_to_bin(uuid())) not null,
    paySeqnum           int                                                           not null,
    orderNo             varchar(255)                                                  not null,
    odPayAmt            int                                                           not null,
    payStatCd           varchar(20)                                                   not null,
    payDt               datetime                                                      not null,
    payMethCd           varchar(10)                                                   null,
    payAprvCd           varchar(20)                                                   null,
    payAprvNum          varchar(10)                                                   null,
    payAprvDt           datetime                                                      null,
    payRespCd           varchar(10)                                                   null,
    payCancAmt          int                                                           null,
    payCancDt           datetime                                                      null,
    transType           varchar(20)                                                   null,
    cardCo              varchar(20)                                                   null,
    mthInstlmt          int                                                           null,
    cardNum             varchar(20)                                                   null,
    bankName            varchar(20)                                                   null,
    cash_receipt_number varchar(20)                                                   null comment '현금영수증 번호',
    cash_receipt_type   enum ('PHONE', 'BUSINESS')                                    null comment '현금영수증 유형',
    cash_receipt_status enum ('APPLIED', 'NOT_APPLIED') default 'NOT_APPLIED'         null comment '현금영수증 상태',
    primary key (payNo, paySeqnum),
    constraint fk_order_no_pay
        foreign key (orderNo) references `order` (orderNo)
);

