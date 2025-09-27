import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class LoginTest {
    public static void main(String[] args) {
        try {
            // URL for login endpoint
            URL url = new URL("http://localhost:8081/api/auth/admin/login");
            
            // Create connection
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);
            
            // Credentials to test (use different combinations)
            String[] usernames = {"admin@bloodbank.com", "superadmin@bloodbank.com", "bcryptadmin@bloodbank.com"};
            String[] passwords = {"admin123", "password"};
            
            for (String username : usernames) {
                for (String password : passwords) {
                    System.out.println("\nTrying login with: " + username + " / " + password);
                    
                    // Create request body
                    String jsonInputString = "{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}";
                    
                    try (DataOutputStream wr = new DataOutputStream(conn.getOutputStream())) {
                        wr.writeBytes(jsonInputString);
                        wr.flush();
                    }
                    
                    // Get response
                    int responseCode = conn.getResponseCode();
                    System.out.println("Response Code: " + responseCode);
                    
                    StringBuilder response = new StringBuilder();
                    try (BufferedReader br = new BufferedReader(
                            new InputStreamReader(responseCode >= 400 ? conn.getErrorStream() : conn.getInputStream()))) {
                        String line;
                        while ((line = br.readLine()) != null) {
                            response.append(line);
                        }
                    }
                    
                    System.out.println("Response: " + response.toString());
                    
                    // Reset connection for next attempt
                    conn.disconnect();
                    if (username != usernames[usernames.length - 1] || password != passwords[passwords.length - 1]) {
                        conn = (HttpURLConnection) url.openConnection();
                        conn.setRequestMethod("POST");
                        conn.setRequestProperty("Content-Type", "application/json");
                        conn.setRequestProperty("Accept", "application/json");
                        conn.setDoOutput(true);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}