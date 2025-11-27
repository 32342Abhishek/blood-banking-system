# Blood Banking System - Login Credentials

## Default Admin Account

### Credentials
- **Email:** `admin@bloodbank.com`
- **Password:** `Admin@123`
- **Role:** ADMIN

### Login URLs

#### Ansible Deployment
- **Admin Login:** http://localhost:5174
- **Backend API:** http://localhost:8082/bloodbank/api/auth/admin/login

#### Kubernetes Deployment
- **Admin Login:** http://localhost:30173
- **Backend API:** http://localhost:30081/api/auth/admin/login

---

## Testing Login

### Using PowerShell
```powershell
$body = @{ 
    email = "admin@bloodbank.com"
    password = "Admin@123" 
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://localhost:8082/bloodbank/api/auth/admin/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$response.Content | ConvertFrom-Json
```

### Using cURL
```bash
curl -X POST http://localhost:8082/bloodbank/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bloodbank.com","password":"Admin@123"}'
```

---

## Important Notes

1. **Change Password After First Login** - The default password should be changed immediately after first login for security reasons

2. **Admin Registration** - If you need to create additional admin accounts, use the admin registration endpoint with the admin code: `ADMIN123`

3. **Password Requirements** - Passwords must meet security requirements (minimum length, complexity, etc.)

4. **Session Management** - The JWT token expires after 24 hours. You'll need to login again after expiration.

---

## Troubleshooting

### 401 Unauthorized Error
- ✅ **Solution:** Use the correct credentials above
- ❌ **Wrong:** `newadmin58430@test.com` or other test credentials
- ✅ **Correct:** `admin@bloodbank.com` / `Admin@123`

### Cannot Connect to Backend
- Check if containers are running: `docker ps --filter "name=bloodbank_"`
- Verify backend URL includes `/bloodbank` context path
- Check backend logs: `docker logs bloodbank_backend`

### Database Issues
- Verify MySQL container is running
- Check database connection in backend logs
- Restart containers if needed: `docker restart bloodbank_mysql bloodbank_backend`

---

**Last Updated:** November 28, 2024  
**Deployment Status:** ✅ Operational
