package com.phegondev.InventoryMgtSystem.services;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otp);
}