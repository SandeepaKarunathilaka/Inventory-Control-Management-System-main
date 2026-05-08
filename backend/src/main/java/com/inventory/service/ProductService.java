package com.inventory.service;

import com.inventory.dto.ProductResponse;
import com.inventory.model.Product;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductResponse> getProducts(Long categoryId) {
        List<Product> products = categoryId == null
                ? productRepository.findAll()
                : productRepository.findByCategoryId(categoryId);
        return products.stream().map(this::toProductResponse).toList();
    }

    public void seedProducts() {
        if (categoryRepository.count() == 0) {
            return;
        }
    }

    private ProductResponse toProductResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getPrice(),
                product.getQuantity(),
                product.getStatus(),
                product.getCategory().getId(),
                product.getCategory().getName()
        );
    }
}
