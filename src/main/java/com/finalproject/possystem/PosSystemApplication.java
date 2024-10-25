package com.finalproject.possystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication(exclude = {HibernateJpaAutoConfiguration.class, DataSourceAutoConfiguration.class})
public class PosSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(PosSystemApplication.class, args);
    }

    @GetMapping
    public String hello(){
        return "Hello,";
    }

}
