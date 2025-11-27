# Quick Database Check Script
# Run this to see all your data in the Blood Banking System database

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "     Blood Banking System - Database Status Check       " -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Check if containers are running
Write-Host "📦 Checking Docker Containers..." -ForegroundColor Yellow
$containers = docker ps --filter "name=bloodbank_" --format "{{.Names}}"
if ($containers) {
    Write-Host "✅ Containers Running:" -ForegroundColor Green
    $containers | ForEach-Object { Write-Host "   - $_" -ForegroundColor White }
} else {
    Write-Host "❌ No bloodbank containers found!" -ForegroundColor Red
    exit
}

Write-Host "`n📊 Database Record Counts:" -ForegroundColor Yellow
Write-Host "─────────────────────────────" -ForegroundColor Gray

docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "
SELECT 'Users' as Table_Name, COUNT(*) as Count FROM users
UNION ALL SELECT 'Donors', COUNT(*) FROM donors  
UNION ALL SELECT 'Hospitals', COUNT(*) FROM hospitals
UNION ALL SELECT 'Blood Donations', COUNT(*) FROM blood_donations
UNION ALL SELECT 'Blood Requests', COUNT(*) FROM blood_requests
UNION ALL SELECT 'Blood Inventory', COUNT(*) FROM blood_inventory
ORDER BY Table_Name;" 2>$null

Write-Host "`n👥 Recent Users:" -ForegroundColor Yellow
Write-Host "─────────────────────────────" -ForegroundColor Gray
docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT id, name, email, role FROM users ORDER BY id DESC LIMIT 5;" 2>$null

Write-Host "`nRECENT DONORS:" -ForegroundColor Yellow
Write-Host "-----------------------------" -ForegroundColor Gray
$donorCount = docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT COUNT(*) as count FROM donors;" 2>$null | Select-String "^\d+"
if ($donorCount -and $donorCount -match "^\d+" -and [int]$Matches[0] -gt 0) {
    docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT id, name, email, blood_group, phone FROM donors ORDER BY id DESC LIMIT 5;" 2>$null
} else {
    Write-Host "   No donors registered yet" -ForegroundColor Gray
}

Write-Host "`n🏥 Hospitals:" -ForegroundColor Yellow
Write-Host "─────────────────────────────" -ForegroundColor Gray  
docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT id, name, phone FROM hospitals LIMIT 5;" 2>$null

Write-Host "`nRECENT BLOOD DONATIONS:" -ForegroundColor Yellow
Write-Host "-----------------------------" -ForegroundColor Gray
$donationCount = docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT COUNT(*) FROM blood_donations;" 2>$null | Select-String "^\d+"
if ($donationCount -and $donationCount -match "^\d+" -and [int]$Matches[0] -gt 0) {
    docker exec bloodbank_mysql mysql -uroot -pAbhi@9142 bloodbank -e "SELECT id, blood_group, quantity_ml, status, donation_date FROM blood_donations ORDER BY id DESC LIMIT 5;" 2>$null
} else {
    Write-Host "   No blood donations yet" -ForegroundColor Gray
}

Write-Host "`n✅ Database check complete!`n" -ForegroundColor Green
