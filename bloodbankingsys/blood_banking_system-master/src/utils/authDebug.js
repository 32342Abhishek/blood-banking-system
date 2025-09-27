// Debug authentication between frontend and backend

// 1. Create a simple script to test the authentication flow
const testApiAuth = async () => {
  // First, log in to get a token
  try {
    console.log("--- Testing Authentication Flow ---");
    console.log("1. Attempting login...");
    const loginResponse = await fetch("http://localhost:8081/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin@example.com", // Replace with valid credentials
        password: "password123"        // Replace with valid credentials
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }
    
    const authData = await loginResponse.json();
    console.log("Login successful! Token received:", 
                authData.token ? `${authData.token.substring(0, 20)}...` : "No token in response");
    
    if (!authData.token) {
      throw new Error("No token received in login response");
    }
    
    // 2. Test a protected endpoint
    console.log("\n2. Testing authenticated API call...");
    const apiResponse = await fetch("http://localhost:8081/api/blood-inventory/stock", {
      headers: {
        "Authorization": `Bearer ${authData.token}`
      }
    });
    
    if (!apiResponse.ok) {
      console.error("API call failed:", apiResponse.status, apiResponse.statusText);
      const responseText = await apiResponse.text();
      console.error("Response body:", responseText);
      throw new Error(`API call failed: ${apiResponse.status} ${apiResponse.statusText}`);
    }
    
    const apiData = await apiResponse.json();
    console.log("API call successful! Received data:", apiData);
    
    // 3. Test with invalid token to confirm authentication works
    console.log("\n3. Testing with invalid token...");
    const invalidResponse = await fetch("http://localhost:8081/api/blood-inventory/stock", {
      headers: {
        "Authorization": "Bearer invalidtoken123"
      }
    });
    
    console.log("Invalid token response:", invalidResponse.status, invalidResponse.statusText);
    
  } catch (error) {
    console.error("Test failed:", error);
  }
};

testApiAuth();