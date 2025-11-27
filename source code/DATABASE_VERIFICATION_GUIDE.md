# Database Verification Guide

## Quick Check Commands

### Check All Data
```powershell
# Check Users
docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT id, name, email, role FROM users ORDER BY id;"

# Check Donors  
docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT id, name, email, blood_group, phone FROM donors ORDER BY id;"

# Check Hospitals
docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT id, name, email, phone FROM hospitals ORDER BY id;"

# Check Blood Donations
docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT id, donor_id, blood_group, quantity_ml, status FROM blood_donations ORDER BY id;"

# Check Blood Requests
docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT id, patient_name, blood_group, units_required, status FROM blood_requests ORDER BY id;"

# Check Blood Inventory
docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT id, blood_type, quantity, expiry_date FROM blood_inventory ORDER BY id;"
```

### Count Records
```powershell
docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "
SELECT 'Users' as Table_Name, COUNT(*) as Count FROM users
UNION ALL SELECT 'Donors', COUNT(*) FROM donors
UNION ALL SELECT 'Hospitals', COUNT(*) FROM hospitals
UNION ALL SELECT 'Blood_Donations', COUNT(*) FROM blood_donations
UNION ALL SELECT 'Blood_Requests', COUNT(*) FROM blood_requests
UNION ALL SELECT 'Blood_Inventory', COUNT(*) FROM blood_inventory;"
```

## Registration Flow

### 1. User Registration (Creates USER)
- **Endpoint**: `POST /api/auth/register`
- **Table**: `users`
- **When**: First time signup
- **Result**: Can login to the system

### 2. Donor Profile (Creates DONOR)
- **Endpoint**: `POST /api/donors`
- **Table**: `donors`
- **When**: After user login, when filling donor form
- **Requires**: Authentication token from login
- **Result**: User becomes eligible to donate blood

### 3. Blood Donation (Creates DONATION)
- **Endpoint**: `POST /api/blood-donations`
- **Table**: `blood_donations`
- **When**: After donor profile exists, when donating blood
- **Requires**: Donor ID
- **Result**: Donation record created

## Why You Might Not See Records

### Common Issues:

1. **Looking in Wrong Table**
   - User registration → `users` table (NOT donors)
   - Donor form → `donors` table (requires login first)

2. **Missing Authentication**
   - `/api/donors` requires Bearer token
   - Must login first to get token

3. **Form Not Submitting**
   - Check browser console for errors
   - Check network tab for failed requests
   - Verify backend logs for errors

4. **Database Connection**
   - MySQL container must be running
   - Backend must be connected to MySQL

## Verification Steps

### After Registration:
```powershell
# 1. Check if user was created
docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT * FROM users ORDER BY id DESC LIMIT 1;"

# 2. Check if donor profile was created  
docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT * FROM donors ORDER BY id DESC LIMIT 1;"

# 3. Check backend logs for errors
docker logs bloodbank_backend --tail 50 | Select-String "ERROR|Exception"
```

## Current Status (As of last check)

✅ **Database is working**
✅ **User registration is working** 
✅ **Donor registration is working**
✅ **Data IS being stored**

Example records found:
- Users: 5 records
- Donors: 1 record (Sarah Connor)
- Hospitals: 10 records

## Testing Registration Manually

```powershell
# Test User Registration
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "Test@123"
    bloodType = "A+"
    role = "USER"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8082/bloodbank/api/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

## If Data Still Not Showing

1. **Refresh your query** - Run the SELECT command again
2. **Check correct database** - Ensure you're connected to "bloodbank" database  
3. **Check correct table** - Users go to `users`, donors go to `donors`
4. **Check backend logs** - Look for SQL INSERT statements
5. **Verify form submission** - Check browser Network tab

## Support

If registration is still not working:
1. Check browser console (F12) for JavaScript errors
2. Check Network tab for API response
3. Check backend logs: `docker logs bloodbank_backend --tail 100`
4. Verify MySQL is running: `docker ps | findstr bloodbank_mysql`
