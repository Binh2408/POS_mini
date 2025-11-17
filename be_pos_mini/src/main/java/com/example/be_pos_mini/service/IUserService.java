package com.example.be_pos_mini.service;

import com.example.be_pos_mini.dto.StaffRequestDTO;
import com.example.be_pos_mini.dto.StoreInfo;
import com.example.be_pos_mini.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    Optional<User> findByUsername(String username);

    Long getStoreIdByUserId(Long userId);

    StoreInfo getStoreByUserId(Long userId);

    Page<User> getStaffByStore(Long storeId, String keyword, int page, int size);

    User createStaff(StaffRequestDTO dto, Long storeId);

    User updateStaff(Long id, StaffRequestDTO dto);

    void deactivateStaff(Long id);
}
