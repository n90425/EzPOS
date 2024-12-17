package com.finalproject.possystem.category.repository;

import com.finalproject.possystem.category.entity.Category;
import com.finalproject.possystem.category.entity.QCategory;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.test.annotation.Rollback;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CategoryRepositoryTest {
    @Autowired
    private CategoryRepository categoryRepo;

    @Autowired
    private EntityManager em;

    @Transactional
    @Rollback(false)
    public void testData() {
        /* 소고기 카테고리 */
        Category caw = new Category();
        caw.setCategoryname("소고기");

        Category loin = new Category();
        loin.setCategoryname("등심");
        loin.setParent(caw);

        Category striploin = new Category();
        striploin.setCategoryname("채끝살");
        striploin.setParent(caw);

        caw.getChildren().add(loin);
        caw.getChildren().add(striploin);

        categoryRepo.save(caw);

        /* 돼지고기 카테고리 */
        Category pig = new Category();
        pig.setCategoryname("돼지고기");

        Category galbi = new Category();
        galbi.setCategoryname("돼지갈비..먹고시포");
        galbi.setParent(pig);

        Category samgyeop = new Category();
        samgyeop.setCategoryname("삼겹살");
        samgyeop.setParent(pig);

        pig.getChildren().add(galbi);
        pig.getChildren().add(samgyeop);

        categoryRepo.save(pig);

        System.out.println(caw);
        System.out.println(pig);
    }

    @Test
    @Transactional
    @Commit
    public void countTest(){
        categoryRepo.deleteAll();
        assertTrue(categoryRepo.count() == 0);

        testData(); // 데이터 추가

        assertTrue(categoryRepo.count() == 6); // 데이터가 3개인지 검증
    }

    @Test
    @DisplayName("querydsl 쿼리작성테스트")
    public void querydsl(){
        QCategory category = QCategory.category;

        JPAQueryFactory qf = new JPAQueryFactory(em);

        JPAQuery<Category> query = qf.selectFrom(category);

        List<Category> list = query.fetch();
        list.forEach(System.out::println);
    }
}
