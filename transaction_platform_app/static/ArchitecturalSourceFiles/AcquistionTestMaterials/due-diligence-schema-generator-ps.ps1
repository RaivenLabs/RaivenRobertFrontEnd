# Function to generate a schema with better error handling
function Generate-Schema-Debug {
    param(
        [string]$baseUrl,
        [string]$documentType,
        [array]$extractionGoals
    )
    
    Write-Host "Starting schema generation with debug output..." -ForegroundColor Cyan
    
    # Get briefing context first
    try {
        $briefingResponse = Invoke-RestMethod -Uri "$baseUrl/api/briefing/test-project-123" -Method Get
        Write-Host "Successfully retrieved briefing context." -ForegroundColor Green
        
        # Display briefing context for debugging
        Write-Host "Briefing context structure:" -ForegroundColor Cyan
        Write-Host "Context keys: $($briefingResponse.context.PSObject.Properties.Name -join ', ')" -ForegroundColor Gray
        Write-Host "Has scope: $($null -ne $briefingResponse.scope)" -ForegroundColor Gray
    }
    catch {
        Write-Host "Warning: Could not retrieve briefing context: $_" -ForegroundColor Yellow
        $briefingResponse = @{
            context = @{
                business_context = "This is a due diligence review for a private equity acquisition"
                project = @{
                    name = "Test Project"
                    type = "Due Diligence"
                }
            }
            scope = "The scope includes reviewing financial statements, operational metrics, and risk factors."
        }
    }
    
    # Create detailed mock analysis results
    $analysisResults = @{
        document_type = $documentType
        extraction_goals = $extractionGoals
        file_analyses = @(
            @{
                file_type = "structured_data"
                filename = "buyside-1-template.xlsx"
                columns = @("Category", "Item", "Status", "Notes", "Responsible Party", "Due Date")
                data_types = @{
                    Category = "object"
                    Item = "object"
                    Status = "object"
                    Notes = "object"
                    "Responsible Party" = "object"
                    "Due Date" = "object"
                }
                sample_data = @(
                    @{
                        Category = "Financial"
                        Item = "Balance Sheet Review"
                        Status = "Pending"
                        Notes = "Need last 3 years"
                        "Responsible Party" = "Finance Team"
                        "Due Date" = "2025-03-15"
                    },
                    @{
                        Category = "Legal"
                        Item = "Contracts Review"
                        Status = "In Progress"
                        Notes = "Focusing on material contracts first"
                        "Responsible Party" = "Legal Team"
                        "Due Date" = "2025-03-20"
                    }
                )
                row_count = 42
            },
            @{
                file_type = "structured_data"
                filename = "DealRoom - Master Diligence Request List.xlsx"
                columns = @("Section", "Subsection", "Request Item", "Priority", "Status", "Owner")
                data_types = @{
                    Section = "object"
                    Subsection = "object"
                    "Request Item" = "object"
                    Priority = "object"
                    Status = "object"
                    Owner = "object"
                }
                sample_data = @(
                    @{
                        Section = "Corporate"
                        Subsection = "Organization"
                        "Request Item" = "Certificate of Incorporation"
                        Priority = "High"
                        Status = "Received"
                        Owner = "Legal"
                    },
                    @{
                        Section = "Financial"
                        Subsection = "Historical Performance"
                        "Request Item" = "Audited Financial Statements (3 years)"
                        Priority = "Critical"
                        Status = "Pending"
                        Owner = "Finance"
                    }
                )
                row_count = 156
            }
        )
        briefing_context = $briefingResponse
    }
    
    # Prepare context data with more details
    $context = @{
        documentType = $documentType
        extractionGoals = $extractionGoals
        userNotes = "Generated via Direct Schema Generation script with debug output"
    }
    
    # Prepare model settings
    $modelSettings = @{
        temperature = 0.2
        maxTokens = 4000
        model = "claude-3-7-sonnet-20250219"
    }
    
    # Prepare request payload
    $payload = @{
        analysisResults = $analysisResults
        context = $context
        modelSettings = $modelSettings
    }
    
    # Convert to JSON with higher depth limit
    $jsonPayload = ConvertTo-Json $payload -Depth 20
    
    # Log payload size for debugging
    $payloadSizeKB = [System.Text.Encoding]::UTF8.GetByteCount($jsonPayload) / 1024
    Write-Host "Payload size: $($payloadSizeKB.ToString('0.00')) KB" -ForegroundColor Cyan
    
    # Check for API connectivity before sending the main request
    try {
        Write-Host "Testing basic API connectivity..." -ForegroundColor Cyan
        $testResponse = Invoke-RestMethod -Uri "$baseUrl/api/test-claude-connection" -Method Get
        Write-Host "API connection verified." -ForegroundColor Green
    }
    catch {
        Write-Host "Warning: API connectivity test failed: $_" -ForegroundColor Yellow
    }
    
    # Send request to API with error capture
    try {
        Write-Host "Sending request to generate schema..." -ForegroundColor Cyan
        
        # Use try/catch with more verbose output
        try {
            $response = Invoke-RestMethod -Uri "$baseUrl/api/generate-schema" -Method Post -Body $jsonPayload -ContentType "application/json"
            Write-Host "Schema generated successfully!" -ForegroundColor Green
            return $response
        }
        catch [System.Net.WebException] {
            $errorResponse = $_.Exception.Response
            if ($null -ne $errorResponse) {
                $reader = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
                $reader.BaseStream.Position = 0
                $reader.DiscardBufferedData()
                $responseBody = $reader.ReadToEnd()
                Write-Host "Error response from API: $responseBody" -ForegroundColor Red
                
                # Try to extract specific error message
                if ($responseBody -match '"error"\s*:\s*"([^"]+)"') {
                    $errorMessage = $matches[1]
                    Write-Host "Error message: $errorMessage" -ForegroundColor Red
                    
                    # Special handling for missing fields error
                    if ($errorMessage -eq "Generated schema is missing fields") {
                        Write-Host "This usually means Claude's response did not contain a proper schema structure." -ForegroundColor Yellow
                        Write-Host "Try increasing the temperature slightly (0.3-0.4) to encourage more creativity," -ForegroundColor Yellow
                        Write-Host "or check if there are formatting issues in the prompt." -ForegroundColor Yellow
                    }
                }
            }
            throw
        }
    }
    catch {
        Write-Host "Schema generation failed: $_" -ForegroundColor Red
        return $null
    }
}

# Example usage:
# $schema = Generate-Schema-Debug -baseUrl "http://localhost:5000" -documentType "due_diligence" -extractionGoals @("Extract financial metrics", "Identify risks")