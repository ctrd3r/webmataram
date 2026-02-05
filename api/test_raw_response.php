<!DOCTYPE html>
<html>
<head>
    <title>Test Raw Response</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #1e293b; color: #e2e8f0; }
        .section { background: #334155; padding: 15px; margin: 10px 0; border-radius: 5px; }
        button { padding: 10px 20px; background: #3b82f6; color: white; border: none; cursor: pointer; margin: 5px; }
        pre { background: #0f172a; padding: 10px; overflow-x: auto; border-radius: 3px; }
        .success { color: #10b981; }
        .error { color: #ef4444; }
    </style>
</head>
<body>
    <h1>🔍 Raw Response Test</h1>
    
    <div class="section">
        <h2>Test cache_manager_simple.php</h2>
        <button onclick="testRaw('cache_manager_simple.php', 'stats')">Test Stats</button>
        <button onclick="testRaw('cache_manager_simple.php', 'clear-expired')">Test Clear Expired</button>
        <div id="result"></div>
    </div>

    <script>
        async function testRaw(file, action) {
            const resultDiv = document.getElementById('result');
            const url = `${file}?action=${action}`;
            
            resultDiv.innerHTML = `<p>Testing: <strong>${url}</strong></p><p>Loading...</p>`;
            
            try {
                const response = await fetch(url);
                
                // Get response details
                const status = response.status;
                const statusText = response.statusText;
                const contentType = response.headers.get('content-type');
                const text = await response.text();
                
                let html = `
                    <h3>Response Details:</h3>
                    <pre>
Status: ${status} ${statusText}
Content-Type: ${contentType}
Content-Length: ${text.length} bytes
                    </pre>
                    
                    <h3>Raw Response:</h3>
                    <pre>${escapeHtml(text)}</pre>
                `;
                
                // Try to parse as JSON
                if (text.trim() === '') {
                    html += `<p class="error">❌ EMPTY RESPONSE!</p>`;
                } else {
                    try {
                        const json = JSON.parse(text);
                        html += `
                            <h3 class="success">✅ Valid JSON:</h3>
                            <pre>${JSON.stringify(json, null, 2)}</pre>
                        `;
                    } catch (e) {
                        html += `
                            <h3 class="error">❌ Invalid JSON:</h3>
                            <pre>${e.message}</pre>
                            <p>First 200 chars:</p>
                            <pre>${escapeHtml(text.substring(0, 200))}</pre>
                        `;
                    }
                }
                
                resultDiv.innerHTML = html;
                
            } catch (error) {
                resultDiv.innerHTML = `
                    <h3 class="error">❌ Fetch Error:</h3>
                    <pre>${error.message}</pre>
                `;
            }
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    </script>
</body>
</html>
