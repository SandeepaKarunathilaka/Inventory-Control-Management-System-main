package com.phegondev.InventoryMgtSystem.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "warehouses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String warehouseName;

    @Column(unique = true)
    private String warehouseCode;

    private String address;

    private String city;

    private String managerName;

    private String contactNumber;

    private Boolean active = true;

    @Column(updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();
}