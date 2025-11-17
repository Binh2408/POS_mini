package com.example.be_pos_mini.controller;

import com.example.be_pos_mini.dto.StoreInfo;
import com.example.be_pos_mini.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping("/{userId}")
    public Long getStoreIdByUserId(@PathVariable Long userId) {
        return userService.getStoreIdByUserId(userId);
    }

    // GET /api/users/{userId}/store
    @GetMapping("/{userId}/store")
    public StoreInfo getStoreByUser(@PathVariable Long userId) {
        StoreInfo store = userService.getStoreByUserId(userId);
        if (store == null) {
            // admin tổng → trả về null
            return new StoreInfo(null, null);
        }
        return store;
    }
}
