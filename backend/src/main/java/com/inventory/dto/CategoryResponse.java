package com.inventory.dto;

import com.inventory.model.CategoryStatus;
import java.time.LocalDateTime;

public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
    private CategoryStatus status;
    private Long productCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CategoryResponse(Long id, String name, String description, CategoryStatus status,
                            Long productCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.productCount = productCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public CategoryStatus getStatus() {
        return status;
    }

    public Long getProductCount() {
        return productCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
