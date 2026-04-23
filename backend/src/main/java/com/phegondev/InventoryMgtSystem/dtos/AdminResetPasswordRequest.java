package com.phegondev.InventoryMgtSystem.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminResetPasswordRequest {

    @NotBlank(message = "New password is required")
    private String newPassword;
}