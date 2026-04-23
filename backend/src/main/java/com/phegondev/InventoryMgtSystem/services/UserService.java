package com.phegondev.InventoryMgtSystem.services;

import com.phegondev.InventoryMgtSystem.dtos.*;
import com.phegondev.InventoryMgtSystem.models.User;

public interface UserService {
    Response registerUser(RegisterRequest registerRequest);

    Response loginUser(LoginRequest loginRequest);

    Response getAllUsers();

    User getCurrentLoggedInUser();

    Response getUserById(Long id);

    Response updateUser(Long id, UserDTO userDTO);

    Response deleteUser(Long id);

    Response getUserTransactions(Long id);

    Response sendForgotPasswordOtp(ForgotPasswordRequest request);

    Response verifyForgotPasswordOtp(VerifyOtpRequest request);

    Response resetPassword(ResetPasswordRequest request);

    Response adminResetPassword(Long userId, AdminResetPasswordRequest request);
}