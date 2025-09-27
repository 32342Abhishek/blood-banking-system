package com.example.demo.controller;

import com.example.demo.util.DataImportExportUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller for handling data import/export operations
 */
@RestController
@RequestMapping("/api/data")
public class DataManagementController {

    private final DataImportExportUtil dataImportExportUtil;
    
    @Autowired
    public DataManagementController(DataImportExportUtil dataImportExportUtil) {
        this.dataImportExportUtil = dataImportExportUtil;
    }
    
    /**
     * Generate sample data for testing
     * 
     * @param donors Number of donors to generate
     * @param donations Number of donations to generate
     * @param hospitals Number of hospitals to generate
     * @return Response with count of generated data
     */
    @PostMapping("/generate-sample")
    public ResponseEntity<?> generateSampleData(
            @RequestParam(defaultValue = "20") int donors,
            @RequestParam(defaultValue = "50") int donations,
            @RequestParam(defaultValue = "5") int hospitals) {
        try {
            // Generate sample data
            dataImportExportUtil.generateSampleData(donors, donations, hospitals);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Sample data generated successfully");
            response.put("donors", donors);
            response.put("donations", donations);
            response.put("hospitals", hospitals);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error generating sample data: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Import donors from a CSV file
     * 
     * @param file CSV file containing donor data
     * @return Response with count of imported records
     */
    @PostMapping("/import/donors")
    public ResponseEntity<?> importDonors(@RequestParam("file") MultipartFile file) {
        try {
            // Create temporary file
            Path tempDir = Files.createTempDirectory("blood_bank_import");
            Path tempFile = Paths.get(tempDir.toString(), file.getOriginalFilename());
            file.transferTo(tempFile.toFile());
            
            // Import donors
            int count = dataImportExportUtil.importDonorsFromCsv(tempFile.toFile());
            
            // Clean up
            Files.deleteIfExists(tempFile);
            Files.deleteIfExists(tempDir);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Donors imported successfully");
            response.put("count", count);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error importing donors: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Import blood donations from a CSV file
     * 
     * @param file CSV file containing blood donation data
     * @return Response with count of imported records
     */
    @PostMapping("/import/donations")
    public ResponseEntity<?> importDonations(@RequestParam("file") MultipartFile file) {
        try {
            // Create temporary file
            Path tempDir = Files.createTempDirectory("blood_bank_import");
            Path tempFile = Paths.get(tempDir.toString(), file.getOriginalFilename());
            file.transferTo(tempFile.toFile());
            
            // Import donations
            int count = dataImportExportUtil.importBloodDonationsFromCsv(tempFile.toFile());
            
            // Clean up
            Files.deleteIfExists(tempFile);
            Files.deleteIfExists(tempDir);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Blood donations imported successfully");
            response.put("count", count);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error importing blood donations: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Import blood inventory from a CSV file
     * 
     * @param file CSV file containing blood inventory data
     * @return Response with count of imported records
     */
    @PostMapping("/import/inventory")
    public ResponseEntity<?> importInventory(@RequestParam("file") MultipartFile file) {
        try {
            // Create temporary file
            Path tempDir = Files.createTempDirectory("blood_bank_import");
            Path tempFile = Paths.get(tempDir.toString(), file.getOriginalFilename());
            file.transferTo(tempFile.toFile());
            
            // Import inventory
            int count = dataImportExportUtil.importBloodInventoryFromCsv(tempFile.toFile());
            
            // Clean up
            Files.deleteIfExists(tempFile);
            Files.deleteIfExists(tempDir);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Blood inventory imported successfully");
            response.put("count", count);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error importing blood inventory: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Export donors to a CSV file
     * 
     * @return CSV file containing donor data
     */
    @GetMapping("/export/donors")
    public ResponseEntity<?> exportDonors() {
        try {
            // Create temporary file
            Path tempDir = Files.createTempDirectory("blood_bank_export");
            File outputFile = Paths.get(tempDir.toString(), "donors.csv").toFile();
            
            // Export donors
            int count = dataImportExportUtil.exportDonorsToCsv(outputFile);
            
            // Read file content
            byte[] fileContent = Files.readAllBytes(outputFile.toPath());
            
            // Clean up
            Files.deleteIfExists(outputFile.toPath());
            Files.deleteIfExists(tempDir);
            
            return ResponseEntity
                    .ok()
                    .header("Content-Disposition", "attachment; filename=donors.csv")
                    .header("Content-Type", "text/csv")
                    .body(fileContent);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error exporting donors: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Export blood donations to a CSV file
     * 
     * @return CSV file containing blood donation data
     */
    @GetMapping("/export/donations")
    public ResponseEntity<?> exportDonations() {
        try {
            // Create temporary file
            Path tempDir = Files.createTempDirectory("blood_bank_export");
            File outputFile = Paths.get(tempDir.toString(), "donations.csv").toFile();
            
            // Export donations
            int count = dataImportExportUtil.exportBloodDonationsToCsv(outputFile);
            
            // Read file content
            byte[] fileContent = Files.readAllBytes(outputFile.toPath());
            
            // Clean up
            Files.deleteIfExists(outputFile.toPath());
            Files.deleteIfExists(tempDir);
            
            return ResponseEntity
                    .ok()
                    .header("Content-Disposition", "attachment; filename=donations.csv")
                    .header("Content-Type", "text/csv")
                    .body(fileContent);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error exporting donations: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}