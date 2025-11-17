package com.example.be_pos_mini.dto;

import lombok.Data;

@Data
public class ItemRequest {
    private Long productId;
    private Integer quantity;
}
