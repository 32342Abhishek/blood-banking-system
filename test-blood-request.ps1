# Test script for blood request functionality
# This script creates a blood request and verifies it's stored in the database

# Base URL for the API
$baseUrl = "http://localhost:8081/api"

# Function to get a JWT token
function Get-AuthToken {
    $loginUrl = "$baseUrl/auth/login"
    $body = @{
        username = "testuser"
        password = "password"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $body -ContentType "application/json"
        return $response.token
    } catch {
        Write-Host "Error getting auth token: $_" -ForegroundColor Red
        return $null
    }
}

# Function to create a blood request
function Create-BloodRequest {
    param (
        [string]$Token
    )
    
    $url = "$baseUrl/blood-requests"
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }
    
    $requestBody = @{
        name = "Test Patient"
        bloodGroup = "A+"
        phone = "1234567890"
        email = "test@example.com"
        location = "Test Hospital Location"
        reason = "Testing blood request API"
        requestStatus = "PENDING"
        unitsNeeded = 2
        priority = "normal"
        hospitalName = "Test Hospital"
    } | ConvertTo-Json
    
    Write-Host "Creating blood request..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $requestBody
        Write-Host "SUCCESS: Blood request created with ID: $($response.id)" -ForegroundColor Green
        return $response
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "FAILED: Blood request creation failed - Status code: $statusCode" -ForegroundColor Red
        
        if ($statusCode -eq 401) {
            Write-Host "Authentication error - Token may be invalid or expired" -ForegroundColor Yellow
        }
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "Error details: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read error response body" -ForegroundColor Red
        }
        
        return $null
    }
}

# Function to verify blood request exists
function Verify-BloodRequest {
    param (
        [string]$Token,
        [string]$Email
    )
    
    $url = "$baseUrl/blood-requests/email/$Email"
    $headers = @{
        "Authorization" = "Bearer $Token"
    }
    
    Write-Host "Verifying blood request by email: $Email..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        
        if ($response -and $response.Length -gt 0) {
            Write-Host "SUCCESS: Found $($response.Length) blood request(s) for email: $Email" -ForegroundColor Green
            foreach ($request in $response) {
                Write-Host "Request ID: $($request.id), Blood Group: $($request.bloodGroup), Status: $($request.requestStatus)" -ForegroundColor Green
            }
            return $response
        } else {
            Write-Host "WARNING: No blood requests found for email: $Email" -ForegroundColor Yellow
            return $null
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "FAILED: Blood request verification failed - Status code: $statusCode" -ForegroundColor Red
        return $null
    }
}

# Main script execution
Clear-Host
Write-Host "Testing Blood Request Functionality" -ForegroundColor Blue
Write-Host "--------------------------------------------------" -ForegroundColor Blue

# Get auth token
Write-Host "Authenticating..." -ForegroundColor Cyan
$token = Get-AuthToken

if ($null -eq $token) {
    Write-Host "Failed to authenticate. Check credentials or server availability." -ForegroundColor Red
    exit
}

Write-Host "Successfully authenticated" -ForegroundColor Green
Write-Host "Token: $($token.Substring(0, [Math]::Min(15, $token.Length)))..." -ForegroundColor Green
Write-Host "--------------------------------------------------" -ForegroundColor Blue

# Create blood request
$email = "test@example.com"
$request = Create-BloodRequest -Token $token

if ($null -eq $request) {
    Write-Host "Failed to create blood request. Exiting." -ForegroundColor Red
    exit
}

Write-Host "--------------------------------------------------" -ForegroundColor Blue

# Verify blood request was created
Start-Sleep -Seconds 2 # Allow time for data to be saved
$foundRequests = Verify-BloodRequest -Token $token -Email $email

Write-Host "--------------------------------------------------" -ForegroundColor Blue
Write-Host "Test complete!" -ForegroundColor Blue