package com.example.be_pos_mini.controller;

import com.example.be_pos_mini.dto.StaffRequestDTO;
import com.example.be_pos_mini.entity.User;
import com.example.be_pos_mini.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staffs")
@RequiredArgsConstructor
public class StaffController {
    private final IUserService userService;

    @GetMapping("/store/{storeId}")
    public ResponseEntity<?> getStaffByStoreId(@PathVariable Long storeId,
                                               @RequestParam(defaultValue = "") String keyword,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int size
    ) {
        try {
            return ResponseEntity.ok(userService.getStaffByStore(storeId, keyword, page, size));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // Tạo nhân viên mới
    @PostMapping("/store/{storeId}")
    public ResponseEntity<?> createStaff(
            @PathVariable Long storeId,
            @Valid @RequestBody StaffRequestDTO dto
    ) {
        try {
            User created = userService.createStaff(dto, storeId);
            return ResponseEntity.ok(Map.of(
                    "message", "Tạo nhân viên thành công",
                    "data", created
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // Cập nhật nhân viên
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStaff(
            @PathVariable Long id,
            @Valid @RequestBody StaffRequestDTO dto
    ) {
        try {
            User updated = userService.updateStaff(id, dto);
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật nhân viên thành công",
                    "data", updated
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // Soft delete (ngưng kích hoạt tài khoản)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateStaff(@PathVariable Long id) {
        try {
            userService.deactivateStaff(id);
            return ResponseEntity.ok(Map.of("message", "Đã vô hiệu hoá nhân viên"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
