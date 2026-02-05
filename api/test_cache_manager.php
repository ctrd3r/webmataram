<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Cache Manager API</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .test-section {
            background: #f5f5f5;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        button {
            background: #3b82f6;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background: #2563eb;
        }
        .result {
            background: white;
            padding: 15px;
            margin-top: 10px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .success {
            color: green;
            font-weight: bold;
        }
        .error {
            color: red;
            font-weight: bold;
        }
        pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>🧪 Cache Manager API Test</h1>
    
    <div class="test-section">
        <h2>Test 1: Get Cache Stats</h2>
        <button onclick="testStats()">Get Stats</button>
        <div id="statsResult" class="result"></div>
    </div>
    
    <div class="test-section">
        <h2>Test 2: Clear Expired Cache</h2>
        <button onclick="testClearExpired()">Clear Expired</button>
        <div id="expiredResult" class="result"></div>
    </div>
    
    <div class="test-section">
        <h2>Test 3: Clear News Cache</h2>
        <button onclick="testClearNews()">Clear News Cache</button>
        <div id="newsResult" class="result"></div>
    </div>
    
    <div class="test-section">
        <h2>Test 4: Clear All Cache</h2>
        <button onclick="testClearAll()">Clear All Cache</button>
        <div id="clearResult" class="result"></div>
    </div>

    <script>
        async function testStats() {
            const resultDiv = document.getElementById('statsResult');
            resultDiv.innerHTML = 'Loading...';
            
            try {
                const response = await fetch('cache_manager.php?action=stats');
                const text = await response.text();
                
                // Try to parse as JSON
                try {
                    const data = JSON.parse(text);
                    resultDiv.innerHTML = `
                        <p class="success">✅ Success!</p>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    `;
                } catch (e) {
                    resultDiv.innerHTML = `
                        <p class="error">❌ Invalid JSON Response</p>
                        <p>Response received:</p>
                        <pre>${text.substring(0, 500)}</pre>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <p class="error">❌ Error: ${error.message}</p>
                `;
            }
        }
        
        async function testClearExpired() {
            const resultDiv = document.getElementById('expiredResult');
            resultDiv.innerHTML = 'Loading...';
            
            try {
                const response = await fetch('cache_manager.php?action=clear-expired');
                const text = await response.text();
                
                try {
                    const data = JSON.parse(text);
                    resultDiv.innerHTML = `
                        <p class="success">✅ Success!</p>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    `;
                } catch (e) {
                    resultDiv.innerHTML = `
                        <p class="error">❌ Invalid JSON Response</p>
                        <p>Response received:</p>
                        <pre>${text.substring(0, 500)}</pre>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <p class="error">❌ Error: ${error.message}</p>
                `;
            }
        }
        
        async function testClearNews() {
            const resultDiv = document.getElementById('newsResult');
            resultDiv.innerHTML = 'Loading...';
            
            try {
                const response = await fetch('cache_manager.php?action=clear-news');
                const text = await response.text();
                
                try {
                    const data = JSON.parse(text);
                    resultDiv.innerHTML = `
                        <p class="success">✅ Success!</p>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    `;
                } catch (e) {
                    resultDiv.innerHTML = `
                        <p class="error">❌ Invalid JSON Response</p>
                        <p>Response received:</p>
                        <pre>${text.substring(0, 500)}</pre>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <p class="error">❌ Error: ${error.message}</p>
                `;
            }
        }
        
        async function testClearAll() {
            const resultDiv = document.getElementById('clearResult');
            resultDiv.innerHTML = 'Loading...';
            
            try {
                const response = await fetch('cache_manager.php?action=clear');
                const text = await response.text();
                
                try {
                    const data = JSON.parse(text);
                    resultDiv.innerHTML = `
                        <p class="success">✅ Success!</p>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    `;
                } catch (e) {
                    resultDiv.innerHTML = `
                        <p class="error">❌ Invalid JSON Response</p>
                        <p>Response received:</p>
                        <pre>${text.substring(0, 500)}</pre>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <p class="error">❌ Error: ${error.message}</p>
                `;
            }
        }
    </script>
</body>
</html>
