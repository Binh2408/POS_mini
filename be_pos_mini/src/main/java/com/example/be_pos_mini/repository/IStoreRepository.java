package com.example.be_pos_mini.repository;

import com.example.be_pos_mini.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IStoreRepository extends JpaRepository<Store, Long> {
}
