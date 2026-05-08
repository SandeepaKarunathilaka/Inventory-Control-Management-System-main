package com.inventory.dto;

public class DashboardStatsResponse {

    private long totalCategories;
    private long activeCategories;
    private long inactiveCategories;
    private long totalProducts;

    public DashboardStatsResponse(long totalCategories, long activeCategories, long inactiveCategories,
                                  long totalProducts) {
        this.totalCategories = totalCategories;
        this.activeCategories = activeCategories;
        this.inactiveCategories = inactiveCategories;
        this.totalProducts = totalProducts;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public long getActiveCategories() {
        return activeCategories;
    }

    public long getInactiveCategories() {
        return inactiveCategories;
    }

    public long getTotalProducts() {
        return totalProducts;
    }
}
