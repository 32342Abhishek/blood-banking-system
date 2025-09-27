package com.example.demo.service;

import com.example.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    
    /**
     * Save a user
     * 
     * @param user The user to save
     * @return The saved user
     */
    User saveUser(User user);
    
    /**
     * Get a user by ID
     * 
     * @param id The ID of the user to retrieve
     * @return An Optional containing the user if found
     */
    Optional<User> getUserById(Long id);
    
    /**
     * Get a user by email
     * 
     * @param email The email of the user to retrieve
     * @return An Optional containing the user if found
     */
    Optional<User> getUserByEmail(String email);
    
    /**
     * Get all users
     * 
     * @return A list of all users
     */
    List<User> getAllUsers();
    
    /**
     * Delete a user
     * 
     * @param id The ID of the user to delete
     */
    void deleteUser(Long id);
    
    /**
     * Authenticate a user
     * 
     * @param email The email of the user
     * @param password The password of the user
     * @return An Optional containing the user if authentication succeeds
     */
    Optional<User> authenticateUser(String email, String password);
    
    /**
     * Find a user by username (email) and password
     * 
     * @param username The username (email) of the user
     * @param password The password of the user
     * @return The user if found, null otherwise
     */
    User findByUsernameAndPassword(String username, String password);
    
    /**
     * Find a user by username (email)
     * 
     * @param username The username (email) of the user
     * @return The user if found, null otherwise
     */
    User findByUsername(String username);
}