# Test script for admin endpoints
# This script tests the admin-specific endpoints after implementing the controllers

# Base URL for the API
$baseUrl = "http://localhost:8081/api"

# Function to get a JWT token for admin
function Get-AdminToken {
    $loginUrl = "$baseUrl/auth/admin/login"
    $body = @{
        username = "admin"
        password = "adminpass"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $body -ContentType "application/json"
        return $response.token
    } catch {
        Write-Host "Error getting admin token: $_" -ForegroundColor Red
        return $null
    }
}

# Function to test an endpoint
function Test-Endpoint {
    param (
        [string]$Endpoint,
        [string]$Token,
        [string]$Description
    )
    
    $url = "$baseUrl$Endpoint"
    $headers = @{
        "Authorization" = "Bearer $Token"
    }
    
    Write-Host "Testing $Description ($url)..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        Write-Host "SUCCESS: $Description endpoint returned data" -ForegroundColor Green
        Write-Host "Response contains $($response.Count) items" -ForegroundColor Green
        return $response
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "FAILED: $Description - Status code: $statusCode" -ForegroundColor Red
        
        if ($statusCode -eq 401) {
            Write-Host "Authentication error - Token may be invalid or expired" -ForegroundColor Yellow
        } elseif ($statusCode -eq 403) {
            Write-Host "Authorization error - User may not have required role" -ForegroundColor Yellow
        }
        return $null
    }
}

# Main script execution
Clear-Host
Write-Host "Testing Admin Endpoints" -ForegroundColor Blue
Write-Host "--------------------------------------------------" -ForegroundColor Blue

# Get admin token
Write-Host "Authenticating as admin..." -ForegroundColor Cyan
$token = Get-AdminToken

if ($null -eq $token) {
    Write-Host "Failed to authenticate. Check admin credentials or server availability." -ForegroundColor Red
    exit
}

Write-Host "Successfully authenticated as admin" -ForegroundColor Green
Write-Host "Token: $($token.Substring(0, [Math]::Min(15, $token.Length)))..." -ForegroundColor Green
Write-Host "--------------------------------------------------" -ForegroundColor Blue

# Test admin endpoints
Write-Host "Testing admin endpoints..." -ForegroundColor Cyan

# Test standard endpoints first as baseline
Test-Endpoint -Endpoint "/health" -Token $token -Description "Health Check"
Test-Endpoint -Endpoint "/blood-donations" -Token $token -Description "All Donations"
Test-Endpoint -Endpoint "/blood-inventory/stock" -Token $token -Description "Inventory Stock"

# Test admin-only endpoints
Test-Endpoint -Endpoint "/blood-donations/pending" -Token $token -Description "Admin Pending Donations"
Test-Endpoint -Endpoint "/blood-requests/pending" -Token $token -Description "Admin Pending Requests"

Write-Host "--------------------------------------------------" -ForegroundColor Blue
Write-Host "Testing complete!" -ForegroundColor Blue