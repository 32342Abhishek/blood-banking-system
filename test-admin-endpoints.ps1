# Test API Authentication for Specific Admin Endpoints
# This script specifically tests the endpoints that are failing with 401 errors

Param(
    [string]$Token = "",
    [string]$BaseUrl = "http://localhost:8081/api",
    [switch]$Debug
)

# If no token provided, prompt for it
if (-not $Token) {
    Write-Host "No token provided. Please enter your authentication token:" -ForegroundColor Yellow
    $Token = Read-Host "Enter your authentication token"
}

# Clean the token (remove quotes if present)
$Token = $Token.Trim() -replace '^"(.*)"$', '$1'

if ($Debug) {
    Write-Host "Token length: $($Token.Length)" -ForegroundColor Cyan
    # Show first 10 chars of token
    Write-Host "Token preview: $($Token.Substring(0, [Math]::Min(10, $Token.Length)))..." -ForegroundColor Cyan
    
    # Check token format (should have 3 parts separated by periods)
    $tokenParts = $Token.Split('.')
    if ($tokenParts.Count -eq 3) {
        Write-Host "Token has correct JWT format (header.payload.signature)" -ForegroundColor Green
        
        # Try to decode the payload (part 2)
        try {
            $payloadBase64 = $tokenParts[1].Replace('-', '+').Replace('_', '/')
            # Padding
            switch ($payloadBase64.Length % 4) {
                0 { break }
                2 { $payloadBase64 += "==" }
                3 { $payloadBase64 += "=" }
            }
            $decodedBytes = [System.Convert]::FromBase64String($payloadBase64)
            $decodedText = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
            $payload = ConvertFrom-Json $decodedText
            
            Write-Host "Decoded token payload:" -ForegroundColor Green
            $payload | Format-List
            
            # Check expiration
            if ($payload.exp) {
                $expDate = [DateTimeOffset]::FromUnixTimeSeconds($payload.exp).LocalDateTime
                if ($expDate -gt (Get-Date)) {
                    Write-Host "Token is valid until $expDate" -ForegroundColor Green
                } else {
                    Write-Host "Token EXPIRED at $expDate" -ForegroundColor Red
                }
            }
            
            # Check role
            if ($payload.role) {
                Write-Host "User role: $($payload.role)" -ForegroundColor Cyan
                if ($payload.role -ne "ADMIN") {
                    Write-Host "WARNING: The failing endpoints may require ADMIN role" -ForegroundColor Yellow
                }
            } else {
                Write-Host "WARNING: Token does not contain role information" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "Error decoding token: $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "WARNING: Token does not have valid JWT format" -ForegroundColor Red
    }
}

# Define the endpoints to test
$endpoints = @(
    "/health",  # Known working endpoint
    "/blood-inventory/stock",  # Known working endpoint
    "/emergency-notifications",  # Known working endpoint
    "/blood-donations/pending",  # Failing with 401
    "/blood-requests/pending"  # Failing with 401
)

# Prepare the headers
$headers = @{
    "Authorization" = "Bearer $Token"
    "Accept" = "application/json"
}

foreach ($endpoint in $endpoints) {
    $url = "$BaseUrl$endpoint"
    
    Write-Host "`n---------------------------------------" -ForegroundColor Cyan
    Write-Host "Testing endpoint: $url" -ForegroundColor Cyan
    Write-Host "---------------------------------------" -ForegroundColor Cyan
    
    try {
        # Make the API request
        $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ContentType "application/json" -ErrorAction Stop
        
        Write-Host "SUCCESS: Endpoint $endpoint returned status 200" -ForegroundColor Green
        Write-Host "Response sample:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 1 | Write-Host
    }
    catch {
        $statusCode = [int]$_.Exception.Response.StatusCode
        $statusDesc = $_.Exception.Response.StatusDescription
        
        Write-Host "FAILED: Endpoint $endpoint returned status $statusCode $statusDesc" -ForegroundColor Red
        
        # Try to get the response body for more information
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody" -ForegroundColor Red
        }
        catch {
            Write-Host "Could not read response body: $_" -ForegroundColor Red
        }
    }
}

Write-Host "`n---------------------------------------" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "---------------------------------------" -ForegroundColor Cyan

Write-Host "If some endpoints are working but others are failing with 401, it suggests:"
Write-Host "1. The failing endpoints require specific roles/permissions (like ADMIN)" -ForegroundColor Yellow
Write-Host "2. Your token might not have the required role claims" -ForegroundColor Yellow
Write-Host "3. The backend may have different security requirements for those endpoints" -ForegroundColor Yellow

Write-Host "`nPossible solutions:" -ForegroundColor Green
Write-Host "1. Ensure you're logged in as an ADMIN user" -ForegroundColor Green
Write-Host "2. Check that the token contains the proper role claims" -ForegroundColor Green
Write-Host "3. Verify the backend permission requirements for these endpoints" -ForegroundColor Green