package com.phegondev.InventoryMgtSystem;

import com.inventory.InventoryApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackageClasses = InventoryApplication.class)
public class InventoryMgtSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryMgtSystemApplication.class, args);
    }

}
