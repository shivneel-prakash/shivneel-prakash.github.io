document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('trx-file');
    const fileNameDisplay = document.getElementById('file-name');
    const parseBtn = document.getElementById('parse-btn');
    const resultsSection = document.getElementById('results-section');
    const emptyState = document.getElementById('empty-state');
    const errorMessage = document.getElementById('error-message');
    const runInfo = document.getElementById('run-info');
    const countersGrid = document.getElementById('counters-grid');
    const testResults = document.getElementById('test-results');
    
    let selectedFile = null;
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            selectedFile = e.target.files[0];
            fileNameDisplay.textContent = selectedFile.name;
            parseBtn.disabled = false;
            errorMessage.style.display = 'none';
        } else {
            selectedFile = null;
            fileNameDisplay.textContent = 'No file selected';
            parseBtn.disabled = true;
        }
    });
    
    parseBtn.addEventListener('click', function() {
        if (!selectedFile) return;
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const xmlContent = e.target.result;
                const xmlDoc = parseTRXFile(xmlContent);
                displayResults(xmlDoc);
                errorMessage.style.display = 'none';
            } catch (error) {
                console.error('Error parsing TRX file:', error);
                errorMessage.textContent = `Error parsing TRX file: ${error.message}`;
                errorMessage.style.display = 'block';
                resultsSection.style.display = 'none';
                emptyState.style.display = 'block';
                
                // Try fallback parsing
                try {
                    const xmlDoc = fallbackParseTRXFile(e.target.result);
                    displayResults(xmlDoc);
                    errorMessage.style.display = 'none';
                } catch (fallbackError) {
                    errorMessage.textContent = `Both parsers failed: ${fallbackError.message}`;
                }
            }
        };
        
        reader.onerror = function() {
            errorMessage.textContent = 'Error reading file';
            errorMessage.style.display = 'block';
        };
        
        reader.readAsText(selectedFile);
    });
    
    function parseTRXFile(xmlContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
        
        // Check for XML parsing errors
        const parseError = xmlDoc.getElementsByTagName('parsererror');
        if (parseError.length > 0) {
            throw new Error('Invalid XML format: ' + parseError[0].textContent);
        }
        
        return xmlDoc;
    }
    
    function fallbackParseTRXFile(xmlContent) {
        // Remove namespace for simpler parsing
        const cleanedXml = xmlContent.replace(/xmlns="[^"]*"/g, '');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(cleanedXml, 'text/xml');
        
        // Check for XML parsing errors
        const parseError = xmlDoc.getElementsByTagName('parsererror');
        if (parseError.length > 0) {
            throw new Error('Fallback parser also failed: ' + parseError[0].textContent);
        }
        
        return xmlDoc;
    }
    
    function getElementText(xmlDoc, tagName) {
        const elements = xmlDoc.getElementsByTagName(tagName);
        return elements.length > 0 ? elements[0].textContent : 'N/A';
    }
    
    function getAttributeValue(element, attrName) {
        return element ? element.getAttribute(attrName) : 'N/A';
    }
    
    function displayResults(xmlDoc) {
        // Extract test run information
        const testRun = xmlDoc.getElementsByTagName('TestRun')[0];
        const runId = getAttributeValue(testRun, 'id');
        const runName = getAttributeValue(testRun, 'name');
        const runUser = getAttributeValue(testRun, 'runUser');
        
        // Extract timing information
        const times = xmlDoc.getElementsByTagName('Times')[0];
        const creationTime = getAttributeValue(times, 'creation');
        const startTime = getAttributeValue(times, 'start');
        const finishTime = getAttributeValue(times, 'finish');
        
        // Extract result summary
        const resultSummary = xmlDoc.getElementsByTagName('ResultSummary')[0];
        const outcome = getAttributeValue(resultSummary, 'outcome');
        
        // Extract counters
        const counters = resultSummary ? resultSummary.getElementsByTagName('Counters')[0] : null;
        const total = getAttributeValue(counters, 'total');
        const executed = getAttributeValue(counters, 'executed');
        const passed = getAttributeValue(counters, 'passed');
        const failed = getAttributeValue(counters, 'failed');
        const error = getAttributeValue(counters, 'error');
        const timeout = getAttributeValue(counters, 'timeout');
        const aborted = getAttributeValue(counters, 'aborted');
        const inconclusive = getAttributeValue(counters, 'inconclusive');
        
        // Display run information
        runInfo.innerHTML = `
            <div class="trx-info-item">
                <div class="trx-info-label">Run ID</div>
                <div class="trx-info-value">${runId}</div>
            </div>
            <div class="trx-info-item">
                <div class="trx-info-label">Run Name</div>
                <div class="trx-info-value">${runName}</div>
            </div>
            <div class="trx-info-item">
                <div class="trx-info-label">User</div>
                <div class="trx-info-value">${runUser}</div>
            </div>
            <div class="trx-info-item">
                <div class="trx-info-label">Creation Time</div>
                <div class="trx-info-value">${formatDateTime(creationTime)}</div>
            </div>
            <div class="trx-info-item">
                <div class="trx-info-label">Start Time</div>
                <div class="trx-info-value">${formatDateTime(startTime)}</div>
            </div>
            <div class="trx-info-item">
                <div class="trx-info-label">Finish Time</div>
                <div class="trx-info-value">${formatDateTime(finishTime)}</div>
            </div>
            <div class="trx-info-item">
                <div class="trx-info-label">Outcome</div>
                <div class="trx-info-value">${outcome}</div>
            </div>
        `;
        
        // Display counters
        countersGrid.innerHTML = `
            <div class="trx-counter-item">
                <div class="trx-counter-value">${total}</div>
                <div class="trx-counter-label">Total Tests</div>
            </div>
            <div class="trx-counter-item">
                <div class="trx-counter-value">${executed}</div>
                <div class="trx-counter-label">Executed</div>
            </div>
            <div class="trx-counter-item">
                <div class="trx-counter-value" style="color: #00ff87;">${passed}</div>
                <div class="trx-counter-label">Passed</div>
            </div>
            <div class="trx-counter-item">
                <div class="trx-counter-value" style="color: #ff4d6d;">${failed}</div>
                <div class="trx-counter-label">Failed</div>
            </div>
            <div class="trx-counter-item">
                <div class="trx-counter-value" style="color: #ffe347;">${error}</div>
                <div class="trx-counter-label">Error</div>
            </div>
            <div class="trx-counter-item">
                <div class="trx-counter-value">${timeout}</div>
                <div class="trx-counter-label">Timeout</div>
            </div>
            <div class="trx-counter-item">
                <div class="trx-counter-value">${aborted}</div>
                <div class="trx-counter-label">Aborted</div>
            </div>
            <div class="trx-counter-item">
                <div class="trx-counter-value">${inconclusive}</div>
                <div class="trx-counter-label">Inconclusive</div>
            </div>
        `;
        
        // Display test results
        const unitTestResults = xmlDoc.getElementsByTagName('UnitTestResult');
        testResults.innerHTML = '';
        
        if (unitTestResults.length === 0) {
            testResults.innerHTML = '<p>No test results found</p>';
        } else {
            for (let i = 0; i < unitTestResults.length; i++) {
                const result = unitTestResults[i];
                const testId = getAttributeValue(result, 'testId');
                const testName = getAttributeValue(result, 'testName');
                const computerName = getAttributeValue(result, 'computerName');
                const duration = getAttributeValue(result, 'duration');
                const startTime = getAttributeValue(result, 'startTime');
                const endTime = getAttributeValue(result, 'endTime');
                const outcome = getAttributeValue(result, 'outcome');
                
                // Find test definition
                const unitTests = xmlDoc.getElementsByTagName('UnitTest');
                let unitTest = null;
                for (let j = 0; j < unitTests.length; j++) {
                    if (unitTests[j].getAttribute('id') === testId) {
                        unitTest = unitTests[j];
                        break;
                    }
                }
                
                const testMethod = unitTest ? unitTest.getElementsByTagName('TestMethod')[0] : null;
                const className = getAttributeValue(testMethod, 'className');
                
                // Get output if available
                const output = result.getElementsByTagName('Output')[0];
                let stdout = '';
                if (output) {
                    const stdoutElem = output.getElementsByTagName('StdOut')[0];
                    if (stdoutElem) {
                        stdout = stdoutElem.textContent;
                    }
                }
                
                const testItem = document.createElement('div');
                testItem.className = 'trx-test-item';
                testItem.innerHTML = `
                    <div class="trx-test-header">
                        <div class="trx-test-name">${testName}</div>
                        <div class="trx-outcome trx-outcome-${outcome.toLowerCase()}">${outcome}</div>
                    </div>
                    <div class="trx-test-details">
                        <div class="trx-detail-item">
                            <div class="trx-detail-label">Computer</div>
                            <div class="trx-detail-value">${computerName}</div>
                        </div>
                        <div class="trx-detail-item">
                            <div class="trx-detail-label">Duration</div>
                            <div class="trx-detail-value">${duration}</div>
                        </div>
                        <div class="trx-detail-item">
                            <div class="trx-detail-label">Start Time</div>
                            <div class="trx-detail-value">${formatDateTime(startTime)}</div>
                        </div>
                        <div class="trx-detail-item">
                            <div class="trx-detail-label">End Time</div>
                            <div class="trx-detail-value">${formatDateTime(endTime)}</div>
                        </div>
                        <div class="trx-detail-item">
                            <div class="trx-detail-label">Class</div>
                            <div class="trx-detail-value">${className}</div>
                        </div>
                    </div>
                    ${stdout ? `
                    <div class="trx-output-section">
                        <div class="trx-output-label">Output</div>
                        <div class="trx-output-content">${stdout}</div>
                    </div>
                    ` : ''}
                `;
                
                testResults.appendChild(testItem);
            }
        }
        
        // Show results and hide empty state
        resultsSection.style.display = 'block';
        emptyState.style.display = 'none';
    }
    
    function formatDateTime(dateTimeString) {
        if (!dateTimeString || dateTimeString === 'N/A') return 'N/A';
        
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString();
        } catch (e) {
            return dateTimeString;
        }
    }
});