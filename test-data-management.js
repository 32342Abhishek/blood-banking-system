
// This script tests the data management functionality

const BASE_URL = 'http://localhost:8081/api';
const token = localStorage.getItem('token');

// Function to make authenticated API call
async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    
    const options = {
        method,
        headers
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    console.log(`Making ${method} request to: ${BASE_URL}${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
    }
    
    return await response.json();
}

// Test stats endpoints
async function testStats() {
    console.log('Testing stats endpoints...');
    
    try {
        console.log('Fetching overall stats...');
        const overallStats = await apiCall('/stats');
        console.log('Overall stats:', overallStats);
        
        console.log('Fetching system stats...');
        const systemStats = await apiCall('/stats/system');
        console.log('System stats:', systemStats);
        
        return { success: true, message: 'Stats endpoints working correctly' };
    } catch (error) {
        console.error('Stats test failed:', error);
        return { success: false, message: `Stats test failed: ${error.message}` };
    }
}

// Test sample data generation
async function testDataGeneration() {
    console.log('Testing sample data generation...');
    
    try {
        console.log('Generating 5 sample donors...');
        const result = await apiCall('/data/generate/donors', 'POST', { count: 5 });
        console.log('Generation result:', result);
        
        return { success: true, message: `Sample data generated: ${result.count} donors` };
    } catch (error) {
        console.error('Data generation test failed:', error);
        return { success: false, message: `Data generation test failed: ${error.message}` };
    }
}

// Run all tests
async function runTests() {
    console.log('Starting data management tests...');
    
    const results = {
        stats: await testStats(),
        dataGeneration: await testDataGeneration()
    };
    
    console.log('===== TEST RESULTS =====');
    for (const [test, result] of Object.entries(results)) {
        const status = result.success ? '✅ PASS' : '❌ FAIL';
        console.log(`${test}: ${status} - ${result.message}`);
    }
    
    console.log('=======================');
}

// Run the tests
runTests().catch(error => {
    console.error('Error running tests:', error);
});