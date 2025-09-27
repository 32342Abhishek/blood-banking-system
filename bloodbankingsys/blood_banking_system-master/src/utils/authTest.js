// Run this script in the browser console to test authentication status

// Function to check authentication
function checkAuth() {
  console.log("----------- AUTH TEST -----------");
  // Check for token in localStorage
  const token = localStorage.getItem('token');
  console.log("Token exists:", !!token);
  if (token) {
    console.log("Token length:", token.length);
    console.log("Token first 20 chars:", token.substring(0, 20) + "...");
  }
  
  // Check user data
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  console.log("User data:", { userId, userName, userRole });
  
  // Test API call with token
  console.log("\nTesting API call with token...");
  fetch("http://localhost:8081/api/health", {
    headers: token ? { "Authorization": `Bearer ${token}` } : {}
  })
  .then(response => {
    console.log("API response status:", response.status);
    return response.text();
  })
  .then(text => {
    console.log("API response body:", text);
  })
  .catch(err => {
    console.error("API call error:", err);
  });
  
  console.log("---------------------------------");
}

// Function to clear authentication
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('loginTimestamp');
  console.log("Auth data cleared from localStorage");
}

// Check current auth status
checkAuth();

// Export functions for use in console
window.checkAuth = checkAuth;
window.clearAuth = clearAuth;