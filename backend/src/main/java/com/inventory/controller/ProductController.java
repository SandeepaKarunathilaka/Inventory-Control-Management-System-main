package com.inventory.controller;

import com.inventory.dto.ProductResponse;
import com.inventory.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getProducts(@RequestParam(required = false) Long categoryId) {
        return productService.getProducts(categoryId);
    }

    @PostMapping("/seed")
    public String seedProducts() {
        productService.seedProducts();
        return "Seed data is loaded automatically when the backend starts.";
    }
}
