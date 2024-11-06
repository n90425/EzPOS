package com.finalproject.possystem.menu.repository;

import com.finalproject.possystem.category.entity.Category;
import com.finalproject.possystem.category.repository.CategoryRepository;
import com.finalproject.possystem.menu.entity.Menu;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.test.annotation.Rollback;

import java.sql.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class MenuRepositoryTest {

    @Autowired
    private MenuRepository menuRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    // Test data insertion method
    @Transactional
    @Rollback(false)  // Rollback을 false로 설정하여 DB에 데이터를 삽입합니다.
    public void testData() {
        // 카테고리 데이터 삽입
        Category category = new Category();
        category.setCategoryname("돼지고기");
        categoryRepo.save(category);  // 카테고리 저장

        // 메뉴 데이터 삽입
        Menu menu1 = new Menu();
        menu1.setMenuId(1);
        menu1.setCategoryId(category.getCategoryId());
        menu1.setMenuName("돼지갈비");
        menu1.setMenuPrice(18000);
        menu1.setMenuDescription("달짝지근 양념에 고기가 배여 남녀노소 누구나 좋아하는 돼지갈비");
        menu1.setMenuImage("/images/samgyeopsal.jpg");
        menu1.setIsVisible('Y');
        menu1.setMenuDate(Date.valueOf("2024-10-10"));

        Menu menu2 = new Menu();
        menu2.setMenuId(2);
        menu2.setCategoryId(category.getCategoryId());
        menu2.setMenuName("삼겹살");
        menu2.setMenuPrice(18000);
        menu2.setMenuDescription("두툼한 360시간 숙성삼겹살");
        menu2.setMenuImage("/images/galbi.jpg");
        menu2.setIsVisible('Y');
        menu2.setMenuDate(Date.valueOf("2024-10-10"));

        menuRepo.save(menu1);  // 메뉴1 저장
        menuRepo.save(menu2);  // 메뉴2 저장
    }

    // 메뉴 카운트 테스트
    @Test
    @Transactional
    @Commit
    public void countTest() {
        menuRepo.deleteAll();  // 이전 데이터를 모두 삭제

        // 초기 상태 확인
        assertTrue(menuRepo.count() == 0);  // 메뉴 데이터가 없을 때

        testData();  // 데이터 삽입

        // 메뉴 데이터 개수 확인
        assertTrue(menuRepo.count() == 2);  // 2개의 메뉴 데이터가 삽입되었는지 확인
    }

    // 메뉴 조회 테스트
    @Test
    @Transactional
    @Commit
    public void findTest() {
        testData();  // 테스트 데이터 삽입

        // 메뉴 ID로 메뉴 찾기
        Menu menu = menuRepo.findByMenuId(1);

        // 메뉴 정보 확인
        assertEquals("돼지갈비", menu.getMenuName());  // 메뉴 이름 확인
        assertEquals(18000, menu.getMenuPrice());   // 메뉴 가격 확인
    }

    // 메뉴 이름으로 메뉴 찾기 테스트
    @Test
    @Transactional
    @Commit
    public void findByMenuNameTest() {
        testData();  // 테스트 데이터 삽입

        // 메뉴 이름으로 찾기
        List<Menu> menuList = menuRepo.findMenuByMenuName("돼지갈비");

        // 메뉴 리스트가 비지 않음을 확인
        assertFalse(menuList.isEmpty());
        assertEquals(1, menuList.size());  // "돼지갈비" 메뉴가 1개일 것
        assertEquals("돼지갈비", menuList.get(0).getMenuName());  // 메뉴 이름 확인
    }
}
