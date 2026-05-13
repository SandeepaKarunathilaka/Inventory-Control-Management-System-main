package com.phegondev.InventoryMgtSystem.services.impl;

import com.phegondev.InventoryMgtSystem.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Web-Inventory Password Reset OTP");
        message.setText(
                "Your Web-Inventory password reset OTP is: " + otp +
                "\n\nThis OTP will expire in 5 minutes." +
                "\nIf you did not request this, please ignore this email."
        );
        javaMailSender.send(message);
    }
}