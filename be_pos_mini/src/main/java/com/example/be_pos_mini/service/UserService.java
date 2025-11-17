package com.example.be_pos_mini.service;

import com.example.be_pos_mini.dto.StaffRequestDTO;
import com.example.be_pos_mini.dto.StoreInfo;
import com.example.be_pos_mini.entity.Role;
import com.example.be_pos_mini.entity.Store;
import com.example.be_pos_mini.entity.User;
import com.example.be_pos_mini.repository.IRoleRepository;
import com.example.be_pos_mini.repository.IStoreRepository;
import com.example.be_pos_mini.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final IUserRepository userRepository;
    private final IStoreRepository storeRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder; // không final

    // setter injection (Spring sẽ tự gọi)


    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Long getStoreIdByUserId(Long userId) {
        return userRepository.findStoreIdByUserId(userId);
    }

    @Override
    public StoreInfo getStoreByUserId(Long userId) {
        return userRepository.findStoreByUserId(userId);
    }

    @Override
    public Page<User> getStaffByStore(Long storeId, String keyword, int page, int size) {
        if (keyword == null) keyword = "";
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.searchStaffByStore(storeId, keyword, pageable);
    }

    @Override
    public User createStaff(StaffRequestDTO dto, Long storeId) {
        Role staffRole = roleRepository.findByName("STAFF")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò STAFF"));
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi nhánh"));

        // Check username theo store
        if (userRepository.existsByUsernameAndStore_Id(dto.getUsername(), storeId)) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại trong chi nhánh này");
        }

        // Check email theo store
        if (userRepository.existsByEmailAndStore_Id(dto.getEmail(), storeId)) {
            throw new RuntimeException("Email đã tồn tại trong chi nhánh này");
        }

        // Check phone theo store
        if (userRepository.existsByPhoneAndStore_Id(dto.getPhone(), storeId)) {
            throw new RuntimeException("Số điện thoại đã tồn tại trong chi nhánh này");
        }

        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .role(staffRole)
                .store(store)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    @Override
    public User updateStaff(Long id, StaffRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setActive(dto.getActive());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return userRepository.save(user);
    }

    @Override
    public void deactivateStaff(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));
        user.setActive(false); // soft delete
        userRepository.save(user);
    }
}
