package com.inventory.config;

import com.inventory.model.Category;
import com.inventory.model.CategoryStatus;
import com.inventory.model.Product;
import com.inventory.model.ProductStatus;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return;
        }

        Category electronics = saveCategory("Electronics", "Devices, accessories, and computer equipment", CategoryStatus.ACTIVE);
        Category stationery = saveCategory("Stationery", "Office and school supplies", CategoryStatus.ACTIVE);
        Category furniture = saveCategory("Furniture", "Office furniture and workstations", CategoryStatus.ACTIVE);
        Category groceries = saveCategory("Groceries", "Daily grocery items for inventory tracking", CategoryStatus.ACTIVE);
        saveCategory("Cleaning Supplies", "Cleaning and maintenance products", CategoryStatus.INACTIVE);

        saveProduct("Laptop", "ELEC-001", "250000", 10, electronics);
        saveProduct("Mouse", "ELEC-002", "3500", 25, electronics);
        saveProduct("Keyboard", "ELEC-003", "7000", 15, electronics);
        saveProduct("Pen", "STAT-001", "100", 200, stationery);
        saveProduct("Notebook", "STAT-002", "350", 100, stationery);
        saveProduct("Office Chair", "FURN-001", "18000", 8, furniture);
        saveProduct("Desk", "FURN-002", "30000", 5, furniture);
        saveProduct("Rice Bag", "GROC-001", "4500", 30, groceries);
        saveProduct("Sugar Pack", "GROC-002", "500", 50, groceries);
    }

    private Category saveCategory(String name, String description, CategoryStatus status) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setStatus(status);
        return categoryRepository.save(category);
    }

    private void saveProduct(String name, String sku, String price, Integer quantity, Category category) {
        Product product = new Product();
        product.setName(name);
        product.setSku(sku);
        product.setPrice(new BigDecimal(price));
        product.setQuantity(quantity);
        product.setStatus(ProductStatus.AVAILABLE);
        product.setCategory(category);
        productRepository.save(product);
    }
}
