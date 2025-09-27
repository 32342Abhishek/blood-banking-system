# Enhanced API Test Script for Blood Banking System
# This script helps test the backend API with authentication

# Configuration
$baseUrl = "http://localhost:8081/api"
$token = ""
$credentialsWorked = $false

# Function to prompt for JWT token manually
function Get-JwtToken {
    $script:token = Read-Host "Enter your JWT token"
    Write-Host "Token set: $($token.Substring(0, [Math]::Min(10, $token.Length)))..." -ForegroundColor Yellow
}

# Function to test an API endpoint
function Test-ApiEndpoint {
    param (
        [string]$endpoint,
        [string]$method = "GET",
        [string]$description = "API endpoint"
    )
    
    $url = "$baseUrl$endpoint"
    Write-Host "`nTesting endpoint: $url ($description)" -ForegroundColor Cyan
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($token) {
        $headers.Add("Authorization", "Bearer $token")
        Write-Host "Using token: $($token.Substring(0, [Math]::Min(10, $token.Length)))..." -ForegroundColor Yellow
    } else {
        Write-Host "No token provided - testing without authentication" -ForegroundColor Yellow
    }
    
    try {
        $params = @{
            Uri = $url
            Method = $method
            Headers = $headers
            ErrorAction = "Stop"
        }
        
        # Add specific options for better cross-origin handling
        $params.Add("UseBasicParsing", $true)
        
        $response = Invoke-RestMethod @params
        Write-Host "Success!" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "Status Code: $statusCode" -ForegroundColor Red
            
            # Try to get response body for more details
            try {
                $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                $reader.Close()
                Write-Host "Response Body:" -ForegroundColor Red
                Write-Host $responseBody -ForegroundColor Red
            }
            catch {
                Write-Host "Could not read response body" -ForegroundColor Red
            }
            
            # Special handling for auth errors
            if ($statusCode -eq 401) {
                Write-Host "Authentication failed - token may be invalid, expired, or improperly formatted" -ForegroundColor Red
            }
            elseif ($statusCode -eq 403) {
                Write-Host "Forbidden - you don't have permission to access this resource" -ForegroundColor Red
            }
        }
    }
}

# Function to attempt login and get token
function Get-LoginToken {
    Write-Host "`n=== Attempting Login to Get Token ===" -ForegroundColor Cyan
    
    # Try admin login first
    $adminLoginBody = @{
        username = "admin@bloodbank.com"
        password = "admin123"
    } | ConvertTo-Json
    
    try {
        Write-Host "Trying admin login..." -ForegroundColor Yellow
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method Post -Body $adminLoginBody -ContentType "application/json" -ErrorAction Stop
        $script:credentialsWorked = $true
        $script:token = $loginResponse.token
        Write-Host "Admin login successful!" -ForegroundColor Green
        Write-Host "Token: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Green
    } 
    catch {
        Write-Host "Admin login failed: $($_.Exception.Message)" -ForegroundColor Yellow
        
        # Try regular login
        $loginBody = @{
            username = "admin"
            password = "password"
        } | ConvertTo-Json
        
        try {
            Write-Host "Trying regular user login..." -ForegroundColor Yellow
            $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
            $script:credentialsWorked = $true
            $script:token = $loginResponse.token
            Write-Host "Regular login successful!" -ForegroundColor Green
            Write-Host "Token: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Green
        } 
        catch {
            Write-Host "All login attempts failed" -ForegroundColor Red
        }
    }
}

# Main menu
function Show-MainMenu {
    Write-Host "`n===== Blood Banking API Test Tool =====" -ForegroundColor Cyan
    Write-Host "1. Set JWT Token manually"
    Write-Host "2. Get token via login"
    Write-Host "3. Test Health Endpoint (No Auth Required)"
    Write-Host "4. Test Blood Inventory (Auth Required)"
    Write-Host "5. Test Donors (Auth Required)"
    Write-Host "6. Test Blood Requests (Auth Required)"
    Write-Host "7. Test Appointments (Auth Required)"
    Write-Host "8. Test Emergency Notifications (Auth Required)"
    Write-Host "9. Show Current Token"
    Write-Host "10. Exit"
    
    $choice = Read-Host "Enter your choice"
    
    switch ($choice) {
        "1" { 
            Get-JwtToken
            Show-MainMenu
        }
        "2" { 
            Get-LoginToken
            Show-MainMenu
        }
        "3" { 
            $response = Test-ApiEndpoint -endpoint "/health" -description "health endpoint (public)"
            $response | Format-List
            Show-MainMenu
        }
        "4" { 
            $response = Test-ApiEndpoint -endpoint "/blood-inventory" -description "blood inventory (protected)"
            if ($response) { $response | Format-Table -AutoSize }
            Show-MainMenu
        }
        "5" { 
            $response = Test-ApiEndpoint -endpoint "/donors" -description "donors endpoint (protected)"
            if ($response) { $response | Format-Table -AutoSize }
            Show-MainMenu
        }
        "6" { 
            $response = Test-ApiEndpoint -endpoint "/blood-requests" -description "blood requests endpoint (protected)"
            if ($response) { $response | Format-Table -AutoSize }
            Show-MainMenu
        }
        "7" { 
            $response = Test-ApiEndpoint -endpoint "/appointments" -description "appointments endpoint (protected)"
            if ($response) { $response | Format-Table -AutoSize }
            Show-MainMenu
        }
        "8" { 
            $response = Test-ApiEndpoint -endpoint "/emergency-notifications" -description "emergency notifications endpoint (protected)"
            if ($response) { $response | Format-Table -AutoSize }
            Show-MainMenu
        }
        "9" {
            if ($token) {
                Write-Host "`nCurrent token: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Cyan
            } else {
                Write-Host "`nNo token currently set" -ForegroundColor Yellow
            }
            Show-MainMenu
        }
        "10" { 
            return 
        }
        default {
            Write-Host "Invalid choice, please try again." -ForegroundColor Red
            Show-MainMenu
        }
    }
}

# Start the tool
Clear-Host
Write-Host "Blood Banking System API Test Tool" -ForegroundColor Green
Write-Host "This tool helps test API endpoints with authentication" -ForegroundColor Green
Write-Host "----------------------------------------------------" -ForegroundColor Green
Show-MainMenu