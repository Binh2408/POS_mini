package com.example.be_pos_mini.dto;

import com.example.be_pos_mini.entity.Role;
import com.example.be_pos_mini.entity.User;

import java.time.LocalDateTime;

public record UserSummaryDTO(Long id, String email, String name, Role role, LocalDateTime createdAt) {
    public static UserSummaryDTO from(User user) {
        return new UserSummaryDTO(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getCreatedAt());
    }
}
