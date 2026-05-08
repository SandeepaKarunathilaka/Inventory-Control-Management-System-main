package com.inventory.repository;

import com.inventory.model.Category;
import com.inventory.model.CategoryStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    long countByStatus(CategoryStatus status);

    @Query("select count(p) from Product p where p.category.id = :categoryId")
    long countProductsByCategoryId(Long categoryId);
}
