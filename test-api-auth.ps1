# Test API Authentication Script
# This script helps test authentication against the backend API

Param(
    [string]$Token = "",
    [string]$Endpoint = "health",
    [string]$BaseUrl = "http://localhost:8081/api",
    [switch]$Debug
)

# If no token provided, try to read from localStorage using Chrome's data
if (-not $Token) {
    Write-Host "No token provided, attempting to read from localStorage..." -ForegroundColor Yellow
    try {
        # This requires the user to be logged in via the web UI first
        $localStoragePath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Local Storage\leveldb"
        Write-Host "Checking for token in $localStoragePath..." -ForegroundColor Gray
        
        # Note: This is a simplified approach and might not work in all cases
        # A more reliable approach would be to use browser developer tools to copy the token
        Write-Host "Please provide your token manually using the -Token parameter" -ForegroundColor Yellow
        
        $Token = Read-Host "Enter your authentication token"
    }
    catch {
        Write-Host "Could not retrieve token automatically: $_" -ForegroundColor Red
        Write-Host "Please provide your token manually using the -Token parameter" -ForegroundColor Yellow
        exit 1
    }
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
        }
        catch {
            Write-Host "Error decoding token: $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "WARNING: Token does not have valid JWT format" -ForegroundColor Red
    }
}

# Construct the full URL
$url = "$BaseUrl/$Endpoint".TrimEnd('/')

# Prepare the headers
$headers = @{
    "Authorization" = "Bearer $Token"
    "Accept" = "application/json"
}

Write-Host "`nSending API request to: $url" -ForegroundColor Cyan
Write-Host "With Authorization header: Bearer $($Token.Substring(0, [Math]::Min(10, $Token.Length)))..." -ForegroundColor Cyan

try {
    # Make the API request
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "`nAPI CALL SUCCESSFUL!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 4
}
catch {
    Write-Host "`nAPI CALL FAILED!" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        $statusDesc = $_.Exception.Response.StatusDescription
        
        Write-Host "Status Code: $statusCode $statusDesc" -ForegroundColor Red
        
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
        
        # Common error solutions
        switch ($statusCode) {
            401 {
                Write-Host "`nAuthorization Error (401 Unauthorized)" -ForegroundColor Yellow
                Write-Host "Possible issues:" -ForegroundColor Yellow
                Write-Host "1. Token is invalid, malformed, or expired" -ForegroundColor Yellow
                Write-Host "2. Token does not have proper format (should be 'Bearer [token]')" -ForegroundColor Yellow
                Write-Host "3. Your user account does not have permission for this resource" -ForegroundColor Yellow
            }
            403 {
                Write-Host "`nForbidden Error (403 Forbidden)" -ForegroundColor Yellow
                Write-Host "You are authenticated but don't have permission to access this resource" -ForegroundColor Yellow
            }
            404 {
                Write-Host "`nNot Found Error (404 Not Found)" -ForegroundColor Yellow
                Write-Host "The requested endpoint '$Endpoint' does not exist" -ForegroundColor Yellow
            }
            500 {
                Write-Host "`nServer Error (500 Internal Server Error)" -ForegroundColor Yellow
                Write-Host "The server encountered an error processing your request" -ForegroundColor Yellow
            }
        }
    }
    else {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}