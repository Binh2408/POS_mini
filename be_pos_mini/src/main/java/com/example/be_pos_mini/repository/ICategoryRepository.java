package com.example.be_pos_mini.repository;

import com.example.be_pos_mini.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICategoryRepository extends JpaRepository<Category, Long> {
}
