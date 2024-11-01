package com.finalproject.possystem.category.repository;

import com.finalproject.possystem.category.entity.Category;
import com.finalproject.possystem.category.entity.QCategory;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
//@Transactional
class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    public void setUp() {
        categoryRepository.deleteAll();
    }

    @Test
    @Transactional
    public void testCategoryInsert() {
        categoryRepository.deleteAll();
        assertTrue(categoryRepository.count()==0);
        //하나씩 3개를 insert
        Category category1 = new Category(1, null, "Beverages", 'Y');
        Category category2 = new Category(2, null, "Snacks", 'Y');
        Category category3 = new Category(3, null, "Snacks", 'Y');

        category1 = categoryRepository.save(category1);
        category2 = categoryRepository.save(category2);
        category3 = categoryRepository.save(category3);

        //name이 Snacks만 비교
        List<Category> categories = categoryRepository.findCategoryByCategoryname("Snacks");
        assertEquals(2, categories.size());
        assertEquals("Snacks", categories.get(0).getCategoryname());

        System.out.println("category1.getCategoryid()  "+category1.getCategoryid());
        //categoru3을 삭세 후 확인
        categoryRepository.deleteById(category3.getCategoryid());
        assertTrue(categoryRepository.existsById(category1.getCategoryid()));
        assertTrue(categoryRepository.existsById(category2.getCategoryid()));
        assertFalse(categoryRepository.existsById(category3.getCategoryid()));

        //3번부터 10개를 insert
        for (int i = 0; i <= 10; i++) {
            Category category4 = new Category(3+i,category1.getCategoryid(),"aaa",'Y');
//                category3.setCategoryid(4 + i);
//                category3.setCategoryid2(1);
//                category3.setCategoryname("aaa");
//                category3.setIsvisible('Y');
            categoryRepository.save(category4);
        }


        assertEquals(13, categoryRepository.count());
    }

//    @Test
//    public void testCategoryUpdate() {
//        categoryRepository.deleteAll();
//        assertTrue(categoryRepository.count()==0);
//        Category category = new Category(1, null, "Drinks", 'Y');
//        categoryRepository.save(category);
//
//        Category foundCategory = categoryRepository.findById(category.getCategoryid()).orElse(null);
//        assertNotNull(foundCategory);
//
//        foundCategory.setCategoryname("Soft Drinks");
//        categoryRepository.save(foundCategory);
//
//        Category updatedCategory = categoryRepository.findById(category.getCategoryid()).orElse(null);
//        assertNotNull(updatedCategory);
//        assertEquals("Soft Drinks", updatedCategory.getCategoryname());
//    }


    @Test
    public void testCategoryDelete(){
        categoryRepository.deleteAll();
    }
}
