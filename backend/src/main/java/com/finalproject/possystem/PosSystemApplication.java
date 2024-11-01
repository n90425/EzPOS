package com.finalproject.possystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@SpringBootApplication
@RequestMapping("/api")
public class PosSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(PosSystemApplication.class, args);
    }

    @GetMapping("/endpoint")
    public String hello(){
        return "api 작동중?";
    }

    @PostMapping("/post-endpoint")
    public String postHello(@RequestParam Map<String, String> testData){
        System.out.println(testData.get("data"));
        return testData.get("data");
    }
}
