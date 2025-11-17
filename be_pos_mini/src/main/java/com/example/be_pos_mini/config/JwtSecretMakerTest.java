package com.example.be_pos_mini.config;


import io.jsonwebtoken.Jwts;
import jakarta.xml.bind.DatatypeConverter;

import javax.crypto.SecretKey;

public class JwtSecretMakerTest {

    public void generateSecretKey() {
        SecretKey key = Jwts.SIG.HS512.key().build();
        String encodedKey = DatatypeConverter.printHexBinary(key.getEncoded());
        System.out.printf("\nKey = [%s]\n", encodedKey);
    }

    public static void main(String[] args) {
        JwtSecretMakerTest test = new JwtSecretMakerTest();
        test.generateSecretKey();
    }
}
