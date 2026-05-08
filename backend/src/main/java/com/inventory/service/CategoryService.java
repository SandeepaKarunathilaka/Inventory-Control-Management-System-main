package com.inventory.service;

import com.inventory.dto.CategoryRequest;
import com.inventory.dto.CategoryResponse;
import com.inventory.dto.DashboardStatsResponse;
import com.inventory.dto.ProductResponse;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.DuplicateResourceException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.model.Category;
import com.inventory.model.CategoryStatus;
import com.inventory.model.Product;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toCategoryResponse)
                .toList();
    }

    public CategoryResponse getCategoryById(Long id) {
        return toCategoryResponse(findCategory(id));
    }

    // This method creates a new category after checking duplicate names.
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String name = cleanName(request.getName());
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Category name already exists");
        }

        Category category = new Category();
        category.setName(name);
        category.setDescription(cleanDescription(request.getDescription()));
        category.setStatus(request.getStatus());
        return toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = findCategory(id);
        String name = cleanName(request.getName());

        categoryRepository.findByNameIgnoreCase(name)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException("Category name already exists");
                });

        category.setName(name);
        category.setDescription(cleanDescription(request.getDescription()));
        category.setStatus(request.getStatus());
        return toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = findCategory(id);
        long productCount = productRepository.findByCategoryId(id).size();
        if (productCount > 0) {
            throw new BadRequestException("Cannot delete category because products are assigned to it.");
        }
        categoryRepository.delete(category);
    }

    // This method returns all products that belong to a selected category.
    public List<ProductResponse> getProductsByCategory(Long id) {
        findCategory(id);
        return productRepository.findByCategoryId(id).stream()
                .map(this::toProductResponse)
                .toList();
    }

    public DashboardStatsResponse getDashboardStats() {
        return new DashboardStatsResponse(
                categoryRepository.count(),
                categoryRepository.countByStatus(CategoryStatus.ACTIVE),
                categoryRepository.countByStatus(CategoryStatus.INACTIVE),
                productRepository.count()
        );
    }

    private Category findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private String cleanName(String name) {
        String cleanedName = name == null ? "" : name.trim();
        // This validation prevents empty category names.
        if (cleanedName.isEmpty()) {
            throw new BadRequestException("Category name is required");
        }
        return cleanedName;
    }

    private String cleanDescription(String description) {
        return description == null ? "" : description.trim();
    }

    private CategoryResponse toCategoryResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getStatus(),
                categoryRepository.countProductsByCategoryId(category.getId()),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
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
