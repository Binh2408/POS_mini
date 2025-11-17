package com.example.be_pos_mini.repository;

import com.example.be_pos_mini.dto.StoreInfo;
import com.example.be_pos_mini.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsernameAndStore_Id(String username, Long storeId);

    boolean existsByEmailAndStore_Id(String email, Long storeId);

    boolean existsByPhoneAndStore_Id(String phone, Long storeId);


    @Query("SELECT u.store.id, u.store.name FROM User u WHERE u.id = :userId")
    Long findStoreIdByUserId(Long userId);

    @Query(value = """
            SELECT s.id AS id, s.name AS name
            FROM user u
            LEFT JOIN store s ON u.store_id = s.id
            WHERE u.id = :userId
            """, nativeQuery = true)
    StoreInfo findStoreByUserId(@Param("userId") Long userId);

    @Query("SELECT u FROM User u WHERE u.role.name = 'STAFF' AND u.active = true AND u.store.id = :storeId")
    List<User> findStaffByStoreId(Long storeId);

    @Query("""
            SELECT u FROM User u 
            WHERE u.role.name = 'STAFF' 
              AND u.store.id = :storeId 
              AND u.active = true 
              AND (
                  LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) 
                  OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))
              )
            """)
    Page<User> searchStaffByStore(@Param("storeId") Long storeId,
                                  @Param("keyword") String keyword,
                                  Pageable pageable);
}
