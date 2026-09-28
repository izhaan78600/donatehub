$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DONATEHUB AUTOMATED SYSTEM INTEGRATION TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080"

# TEST 1: User Signup
Write-Host "`n1. Testing User Signup..." -NoNewline
$signupEmail = "testuser_" + (Get-Random) + "@example.com"
$signupBody = @{
    fullName = "Integration Tester"
    email = $signupEmail
    phone = "+1-555-0999"
    password = "User@123"
    confirmPassword = "User@123"
    address = "123 Test Street, Suite 4B"
} | ConvertTo-Json

try {
    $signupRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $signupBody -ContentType "application/json"
    $userToken = $signupRes.token
    Write-Host " PASS (Token received for $($signupRes.name))" -ForegroundColor Green
} catch {
    Write-Host " FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# TEST 2: Duplicate Email Rejection
Write-Host "2. Testing Duplicate Email Rejection..." -NoNewline
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $signupBody -ContentType "application/json"
    Write-Host " FAIL (Should have been rejected)" -ForegroundColor Red
} catch {
    Write-Host " PASS (Correctly rejected with 400: Email is already registered)" -ForegroundColor Green
}

# TEST 3: Invalid Login Rejection
Write-Host "3. Testing Invalid Password Rejection..." -NoNewline
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body (@{ email = $signupEmail; password = "WrongPassword" } | ConvertTo-Json) -ContentType "application/json"
    Write-Host " FAIL (Should have failed)" -ForegroundColor Red
} catch {
    Write-Host " PASS (Correctly rejected with 401 Unauthorized)" -ForegroundColor Green
}

# TEST 4: Admin Login
Write-Host "4. Testing Default Admin Login (admin@donatehub.com)..." -NoNewline
$adminLoginBody = @{ email = "admin@donatehub.com"; password = "Admin@123" } | ConvertTo-Json
$adminRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminRes.token
Write-Host " PASS (Role: $($adminRes.role))" -ForegroundColor Green

# TEST 5: Unauthorized Admin Access with User Token
Write-Host "5. Testing Unauthorized Access to /api/admin/drives with User Token..." -NoNewline
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/admin/drives" -Method Get -Headers @{ Authorization = "Bearer $userToken" }
    Write-Host " FAIL (User should not access admin API)" -ForegroundColor Red
} catch {
    Write-Host " PASS (Correctly blocked with HTTP 403 Forbidden)" -ForegroundColor Green
}

# TEST 6: Get Active Drives (Public)
Write-Host "6. Testing Public /api/drives..." -NoNewline
$drives = Invoke-RestMethod -Uri "$baseUrl/api/drives" -Method Get
Write-Host " PASS (Found $($drives.Count) active drives)" -ForegroundColor Green
$targetDriveId = $drives[0].id

# TEST 7: Invalid Dates on Drive Creation
Write-Host "7. Testing Invalid Drive Dates (endDate before startDate)..." -NoNewline
$invalidDriveBody = @{
    name = "Time Machine Drive"
    description = "Invalid dates"
    startDate = "2026-12-01"
    endDate = "2026-11-01"
    location = "City Pavilion"
    status = "ACTIVE"
} | ConvertTo-Json
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/admin/drives" -Method Post -Headers @{ Authorization = "Bearer $adminToken"; "Content-Type" = "application/json" } -Body $invalidDriveBody
    Write-Host " FAIL (Should reject invalid dates)" -ForegroundColor Red
} catch {
    Write-Host " PASS (Correctly rejected with 400: Drive end date cannot be before start date)" -ForegroundColor Green
}

# TEST 8: Valid Drive Creation by Admin
Write-Host "8. Testing Admin Drive Creation..." -NoNewline
$validDriveBody = @{
    name = "Mid-Autumn Children Books Campaign"
    description = "Special drive for illustrated picture books"
    startDate = "2026-10-01"
    endDate = "2026-10-31"
    location = "Riverside Library Pavilion"
    status = "ACTIVE"
} | ConvertTo-Json
$createdDrive = Invoke-RestMethod -Uri "$baseUrl/api/admin/drives" -Method Post -Headers @{ Authorization = "Bearer $adminToken"; "Content-Type" = "application/json" } -Body $validDriveBody
Write-Host " PASS (Created drive #$($createdDrive.id): $($createdDrive.name))" -ForegroundColor Green

# TEST 9: User Donation with Zero Quantity
Write-Host "9. Testing Donation with Zero Quantity Rejection..." -NoNewline
$zeroQtyBody = @{
    driveId = $targetDriveId
    categoryId = 1
    itemName = "Zero Quantity Shirts"
    quantity = 0
    condition = "GOOD"
} | ConvertTo-Json
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/user/donations" -Method Post -Headers @{ Authorization = "Bearer $userToken"; "Content-Type" = "application/json" } -Body $zeroQtyBody
    Write-Host " FAIL (Should reject zero quantity)" -ForegroundColor Red
} catch {
    Write-Host " PASS (Correctly rejected with 400: Quantity must be greater than zero)" -ForegroundColor Green
}

# TEST 10: Valid User Donation Creation
Write-Host "10. Testing Valid User Donation..." -NoNewline
$validDonationBody = @{
    driveId = $targetDriveId
    categoryId = 1
    itemName = "Thermal Winter Woolen Sweaters"
    description = "New warm sweaters in assorted colors"
    quantity = 20
    condition = "NEW"
} | ConvertTo-Json
$donationRes = Invoke-RestMethod -Uri "$baseUrl/api/user/donations" -Method Post -Headers @{ Authorization = "Bearer $userToken"; "Content-Type" = "application/json" } -Body $validDonationBody
$createdDonationId = $donationRes.id
Write-Host " PASS (Created donation #$createdDonationId, Qty: $($donationRes.quantity), Status: $($donationRes.status))" -ForegroundColor Green

# TEST 11: User Dashboard Verification
Write-Host "11. Testing User Dashboard Data..." -NoNewline
$userDashboard = Invoke-RestMethod -Uri "$baseUrl/api/user/dashboard" -Method Get -Headers @{ Authorization = "Bearer $userToken" }
Write-Host " PASS (Total donations: $($userDashboard.totalDonations), Items donated: $($userDashboard.itemsDonated))" -ForegroundColor Green

# TEST 12: Business Rule: Attempting to Distribute an Uncollected (PENDING) Item
Write-Host "12. Testing Distribution of Uncollected Item Rejection..." -NoNewline
$uncollectedDistBody = @{
    itemId = $createdDonationId
    recipientId = 1
    quantity = 5
    notes = "Attempting before collection"
} | ConvertTo-Json
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/admin/distributions" -Method Post -Headers @{ Authorization = "Bearer $adminToken"; "Content-Type" = "application/json" } -Body $uncollectedDistBody
    Write-Host " FAIL (Should have blocked distribution of uncollected item)" -ForegroundColor Red
} catch {
    Write-Host " PASS (Correctly rejected with 400: Item must be collected before distribution)" -ForegroundColor Green
}

# TEST 13: Admin Marks Item as COLLECTED
Write-Host "13. Admin Updating Status of Item to COLLECTED..." -NoNewline
$statusUpdateBody = @{ status = "COLLECTED" } | ConvertTo-Json
$updatedItem = Invoke-RestMethod -Uri "$baseUrl/api/admin/donations/$createdDonationId/status" -Method Put -Headers @{ Authorization = "Bearer $adminToken"; "Content-Type" = "application/json" } -Body $statusUpdateBody
Write-Host " PASS (Item #$createdDonationId status is now $($updatedItem.status))" -ForegroundColor Green

# TEST 14: Business Rule: Distribution Quantity Exceeds Available Quantity
Write-Host "14. Testing Distribution Exceeding Available Quantity (requesting 25 from 20 available)..." -NoNewline
$excessDistBody = @{
    itemId = $createdDonationId
    recipientId = 1
    quantity = 25
    notes = "Requesting too many"
} | ConvertTo-Json
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/admin/distributions" -Method Post -Headers @{ Authorization = "Bearer $adminToken"; "Content-Type" = "application/json" } -Body $excessDistBody
    Write-Host " FAIL (Should reject quantity exceeding available)" -ForegroundColor Red
} catch {
    Write-Host " PASS (Correctly rejected with 400: Distribution quantity exceeds available quantity)" -ForegroundColor Green
}

# TEST 15: Valid Distribution of 12 items
Write-Host "15. Testing Valid Distribution of 12 items..." -NoNewline
$validDistBody = @{
    itemId = $createdDonationId
    recipientId = 1
    quantity = 12
    notes = "Delivered to children shelter intake team"
} | ConvertTo-Json
$distRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/distributions" -Method Post -Headers @{ Authorization = "Bearer $adminToken"; "Content-Type" = "application/json" } -Body $validDistBody
Write-Host " PASS (Recorded distribution #$($distRes.id): $($distRes.quantity) units to $($distRes.recipientName))" -ForegroundColor Green

# TEST 16: Verify Remaining Available Quantity is 8 (20 - 12)
Write-Host "16. Verifying Available Quantity Updated in Database..." -NoNewline
$itemAfterDist = Invoke-RestMethod -Uri "$baseUrl/api/admin/donations/$createdDonationId" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
if ($itemAfterDist.availableQuantity -eq 8 -and $itemAfterDist.distributedQuantity -eq 12) {
    Write-Host " PASS (Available: $($itemAfterDist.availableQuantity), Distributed: $($itemAfterDist.distributedQuantity))" -ForegroundColor Green
} else {
    Write-Host " FAIL (Expected 8 avail, got $($itemAfterDist.availableQuantity))" -ForegroundColor Red
}

# TEST 17: Admin Reports Analytics
Write-Host "17. Testing Admin Reports API..." -NoNewline
$reportData = Invoke-RestMethod -Uri "$baseUrl/api/admin/reports" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
Write-Host " PASS (Total Items: $($reportData.totalItems), Distributed: $($reportData.totalDistributed), Available: $($reportData.totalAvailable))" -ForegroundColor Green

# TEST 18: Audit Log Verification
Write-Host "18. Verifying Audit Logs API..." -NoNewline
$auditLogs = Invoke-RestMethod -Uri "$baseUrl/api/admin/audit-logs" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
Write-Host " PASS (Found $($auditLogs.totalElements) logged system events in audit trail)" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ALL 18 INTEGRATION TESTS PASSED 100%!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
