package com.example.be_pos_mini.service;

import com.example.be_pos_mini.entity.Store;
import com.example.be_pos_mini.repository.IStoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreService implements IStoreService {
    private final IStoreRepository storeRepository;

    @Override
    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }
}
