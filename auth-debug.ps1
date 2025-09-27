# Auth Debug Script for Blood Banking System API

# Configuration
$baseUrl = "http://localhost:8081/api"
$loginUrl = "$baseUrl/auth/login"
$adminLoginUrl = "$baseUrl/auth/admin/login"
$registerUrl = "$baseUrl/auth/register"

# Function to test API auth endpoints
function Test-Auth {
    param (
        [string]$endpoint,
        [object]$body,
        [string]$description
    )
    
    Write-Host "`n=== Testing $description ===" -ForegroundColor Cyan
    Write-Host "POST $endpoint" -ForegroundColor Yellow
    Write-Host "Request Body: $($body | ConvertTo-Json)" -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri $endpoint -Method POST -Body ($body | ConvertTo-Json) -ContentType "application/json" -ErrorAction Stop
        Write-Host "SUCCESS!" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Green
        $response | Format-List | Out-String | Write-Host -ForegroundColor Green
        return $response
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "FAILED - Status Code: $statusCode" -ForegroundColor Red
        
        try {
            $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            Write-Host "Error Response: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read error response" -ForegroundColor Red
        }
        return $null
    }
}

# First, try to register a new admin
$randomSuffix = Get-Random -Maximum 99999
$newAdminEmail = "newadmin$randomSuffix@test.com"
$newAdminPassword = "Admin123!"

Write-Host "`n=== STEP 1: Register a new admin ===" -ForegroundColor Magenta

$registerBody = @{
    name = "New Admin User $randomSuffix"
    email = $newAdminEmail
    password = $newAdminPassword
    role = "ADMIN" # Note: The backend might override this to USER
}

$registerResponse = Test-Auth -endpoint $registerUrl -body $registerBody -description "User Registration"

if ($registerResponse) {
    Write-Host "`nRegistration successful! User ID: $($registerResponse.userId), Role: $($registerResponse.role)" -ForegroundColor Green
    
    # If the backend enforces USER role, update to ADMIN via database
    if ($registerResponse.role -ne "ADMIN") {
        Write-Host "`n=== Updating user role to ADMIN via database ===" -ForegroundColor Yellow
        $userId = $registerResponse.userId
        $updateQuery = "UPDATE users SET role='ADMIN' WHERE id=$userId;"
        
        try {
            docker exec -i blood-bank-mysql mysql -u root -pAbhishek bloodbank -e "$updateQuery"
            Write-Host "User role updated to ADMIN" -ForegroundColor Green
        } catch {
            Write-Host "Failed to update user role: $_" -ForegroundColor Red
        }
    }
    
    # Store token from registration
    $token = $registerResponse.token
    Write-Host "Token received: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Yellow
    
    # Step 2: Try to login as this user with regular login
    Write-Host "`n=== STEP 2: Test regular login with new user ===" -ForegroundColor Magenta
    
    $loginBody = @{
        username = $newAdminEmail
        password = $newAdminPassword
    }
    
    $loginResponse = Test-Auth -endpoint $loginUrl -body $loginBody -description "Regular Login"
    
    # Step 3: Try to login as admin
    Write-Host "`n=== STEP 3: Test admin login with new user ===" -ForegroundColor Magenta
    
    $adminLoginBody = @{
        username = $newAdminEmail
        password = $newAdminPassword
    }
    
    $adminLoginResponse = Test-Auth -endpoint $adminLoginUrl -body $adminLoginBody -description "Admin Login"
    
    if ($adminLoginResponse) {
        $adminToken = $adminLoginResponse.token
        Write-Host "Admin token received: $($adminToken.Substring(0, [Math]::Min(20, $adminToken.Length)))..." -ForegroundColor Yellow
        
        # Test protected endpoint with admin token
        Write-Host "`n=== STEP 4: Test protected endpoint with admin token ===" -ForegroundColor Magenta
        
        try {
            $headers = @{
                "Authorization" = "Bearer $adminToken"
                "Content-Type" = "application/json"
            }
            
            $response = Invoke-RestMethod -Uri "$baseUrl/blood-inventory" -Headers $headers -Method GET -ErrorAction Stop
            Write-Host "SUCCESS - Blood inventory retrieved!" -ForegroundColor Green
            Write-Host "Inventory items: $($response.Count)" -ForegroundColor Green
            $response | Format-Table -AutoSize | Out-String | Write-Host -ForegroundColor Green
        } catch {
            Write-Host "Failed to access protected endpoint: $_" -ForegroundColor Red
            try {
                $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                $reader.Close()
                Write-Host "Error Response: $responseBody" -ForegroundColor Red
            } catch {
                Write-Host "Could not read error response" -ForegroundColor Red
            }
        }
    }
} else {
    Write-Host "Registration failed, trying with existing users..." -ForegroundColor Yellow
    
    # Try some hardcoded credentials
    $knownCredentials = @(
        @{username = "admin@bloodbank.com"; password = "admin123"},
        @{username = "bcryptadmin@bloodbank.com"; password = "password"},
        @{username = "admin@example.com"; password = "password"},
        @{username = "admin"; password = "admin123"}
    )
    
    foreach ($cred in $knownCredentials) {
        Write-Host "`n=== Trying login with $($cred.username) ===" -ForegroundColor Yellow
        $adminLoginResponse = Test-Auth -endpoint $adminLoginUrl -body $cred -description "Admin Login with $($cred.username)"
        
        if ($adminLoginResponse) {
            Write-Host "Found working admin credentials!" -ForegroundColor Green
            break
        }
    }
}

Write-Host "`nAuthentication debugging completed!" -ForegroundColor Magenta