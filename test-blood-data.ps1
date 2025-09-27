# Blood Banking System - Data Management Test Script
# This script tests the data import/export functionality and statistics

# Environment Variables
$baseUrl = "http://localhost:8081/api"

Write-Host "Blood Banking System - Data Management Test Script" -ForegroundColor Cyan

# Check if the server is running
try {
    Write-Host "Testing server connection..." -NoNewline
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET -ErrorAction Stop
    Write-Host "OK" -ForegroundColor Green
}
catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host "Error: Server is not running or health endpoint is not available" -ForegroundColor Red
    Write-Host "Make sure the server is running on http://localhost:8081" -ForegroundColor Yellow
    exit
}

# Step 1: Generate sample data
Write-Host "Generating sample data..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/data/generate-sample?donors=20&donations=50&hospitals=5" -Method POST -ErrorAction Stop
    Write-Host "OK" -ForegroundColor Green
    Write-Host "  - Generated $($response.donors) donors"
    Write-Host "  - Generated $($response.donations) donations"
    Write-Host "  - Generated $($response.hospitals) hospitals"
}
catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 2: Get overall stats
Write-Host "Fetching overall statistics..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/stats" -Method GET -ErrorAction Stop
    Write-Host "OK" -ForegroundColor Green
    Write-Host "  - Total donors: $($response.totalDonors)"
    Write-Host "  - Total donations: $($response.totalDonations)"
    Write-Host "  - Total blood requests: $($response.totalBloodRequests)"
    Write-Host "  - Total hospitals: $($response.totalHospitals)"
    
    if ($response.criticalBloodGroups -and $response.criticalBloodGroups.Count -gt 0) {
        Write-Host "  - Critical blood groups: $($response.criticalBloodGroups -join ', ')" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Get donor stats
Write-Host "Fetching donor statistics..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/stats/donors" -Method GET -ErrorAction Stop
    Write-Host "OK" -ForegroundColor Green
    Write-Host "  - Total donors: $($response.totalDonors)"
    Write-Host "  - Active donors: $($response.activeDonors)"
    Write-Host "  - Eligible donors: $($response.eligibleDonors)"
    
    Write-Host "  - Blood group distribution:"
    $response.donorsByBloodGroup.PSObject.Properties | ForEach-Object {
        Write-Host "    - $($_.Name): $($_.Value)"
    }
}
catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Get inventory stats
Write-Host "Fetching inventory statistics..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/stats/inventory" -Method GET -ErrorAction Stop
    Write-Host "OK" -ForegroundColor Green
    Write-Host "  - Total available units: $($response.totalAvailableUnits)"
    Write-Host "  - Units expiring next week: $($response.unitExpiringNextWeek)"
    
    Write-Host "  - Available units by blood group:"
    $response.availableUnitsByBloodGroup.PSObject.Properties | ForEach-Object {
        Write-Host "    - $($_.Name): $($_.Value)"
    }
}
catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 5: Export donors to CSV
Write-Host "Exporting donors to CSV..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/data/export/donors" -Method GET -ErrorAction Stop -OutFile "donors.csv"
    Write-Host "OK" -ForegroundColor Green
    Write-Host "  - Saved to donors.csv"
}
catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 6: Export donations to CSV
Write-Host "Exporting donations to CSV..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/data/export/donations" -Method GET -ErrorAction Stop -OutFile "donations.csv"
    Write-Host "OK" -ForegroundColor Green
    Write-Host "  - Saved to donations.csv"
}
catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest script completed." -ForegroundColor Cyan
Write-Host "You can now work with the generated data in your database." -ForegroundColor Cyan