# Test Schema Saving Functionality
# This script tests saving a simple predefined schema to verify API functionality

# Base URL for the API
$baseUrl = "http://localhost:5000"

# Create a sample schema
$sampleSchema = @{
    name = "due_diligence_schema"
    description = "Schema for due diligence document extraction"
    fields = @(
        @{
            name = "document_id"
            type = "string"
            description = "Unique identifier for the document"
            required = $true
        },
        @{
            name = "document_title"
            type = "string"
            description = "Title of the document"
            required = $true
        },
        @{
            name = "document_date"
            type = "date"
            description = "Date of the document"
            required = $true
            format = "YYYY-MM-DD"
        },
        @{
            name = "document_type"
            type = "string"
            description = "Type of document (e.g., contract, financial statement)"
            required = $true
        },
        @{
            name = "parties_involved"
            type = "array"
            description = "List of parties involved in the document"
            required = $false
            items = @{
                type = "object"
                fields = @(
                    @{
                        name = "party_name"
                        type = "string"
                        description = "Name of the party"
                        required = $true
                    },
                    @{
                        name = "party_role"
                        type = "string"
                        description = "Role of the party in the document"
                        required = $false
                    }
                )
            }
        },
        @{
            name = "financial_data"
            type = "object"
            description = "Financial information extracted from the document"
            required = $false
            fields = @(
                @{
                    name = "revenue"
                    type = "number"
                    description = "Revenue amount"
                    required = $false
                },
                @{
                    name = "expenses"
                    type = "number"
                    description = "Expense amount"
                    required = $false
                },
                @{
                    name = "profit"
                    type = "number"
                    description = "Profit amount"
                    required = $false
                }
            )
        }
    )
}

# Project ID to save to
$projectId = Read-Host "Enter project ID to save schema to (default: test-project)"
if ([string]::IsNullOrWhiteSpace($projectId)) {
    $projectId = "test-project"
}

Write-Host "Testing schema saving to project ID: $projectId" -ForegroundColor Cyan

# Convert schema to JSON
$jsonPayload = ConvertTo-Json $sampleSchema -Depth 20

# Save to file first for verification
$filePath = "sample-schema.json"
$jsonPayload | Set-Content -Path $filePath
Write-Host "Schema saved to $filePath for verification" -ForegroundColor Green

# Send to API
try {
    Write-Host "Sending schema to API..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "$baseUrl/api/save-schema/$projectId" -Method Post -Body $jsonPayload -ContentType "application/json"
    Write-Host "Schema saved successfully to API!" -ForegroundColor Green
    Write-Host "API Response: $response" -ForegroundColor Green
}
catch {
    Write-Host "Error saving schema to API: $_" -ForegroundColor Red
    
    # Try to get response details
    try {
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "Could not read response details: $_" -ForegroundColor Red
    }
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")