package com.inventory.dto;

import com.inventory.model.ProductStatus;
import java.math.BigDecimal;

public class ProductResponse {

    private Long id;
    private String name;
    private String sku;
    private BigDecimal price;
    private Integer quantity;
    private ProductStatus status;
    private Long categoryId;
    private String categoryName;

    public ProductResponse(Long id, String name, String sku, BigDecimal price, Integer quantity,
                           ProductStatus status, Long categoryId, String categoryName) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.price = price;
        this.quantity = quantity;
        this.status = status;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSku() {
        return sku;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }
}
