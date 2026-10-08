param (
    [string]$WebhookUrl = "https://your-n8n-instance.app.n8n.cloud/webhook-test/ticket-classifier"
)

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  TESTING AI IT HELPDESK n8n WORKFLOW (7 TESTS)  " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Target URL: $WebhookUrl`n"

$tests = Get-Content -Raw "$PSScriptRoot/test-cases.json" | ConvertFrom-Json

foreach ($t in $tests) {
    Write-Host "-------------------------------------------------" -ForegroundColor Yellow
    Write-Host "Test #$($t.id): $($t.payload.title)" -ForegroundColor Yellow
    Write-Host "Expected: Category=$($t.expected.category) | Priority=$($t.expected.priority) | Team=$($t.expected.assignedTeam) | Alert=$($t.expected.telegramAlert)" -ForegroundColor Gray

    $jsonBody = $t.payload | ConvertTo-Json -Compress

    try {
        $response = Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $jsonBody -ContentType "application/json" -TimeoutSec 30
        Write-Host "Response received:" -ForegroundColor Green
        $response | Format-Custom | Out-String | Write-Host -ForegroundColor Green
    } catch {
        Write-Host "Error sending request: $_" -ForegroundColor Red
    }
    Start-Sleep -Seconds 1
}

Write-Host "`nAll test cases submitted!" -ForegroundColor Cyan
