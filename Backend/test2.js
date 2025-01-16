import Agent from 'undici'
import ProxyAgent from 'proxy-agent'
const authCode =
  "v%5E1.1%23i%5E1%23r%5E1%23p%5E3%23f%5E0%23I%5E3%23t%5EUl41Xzk6QUE1NEJGMTREMUVGQzRBNDVFQUQ4QkY3ODg1MTZBNzlfMV8xI0VeMjYw";


const clientId = "LalithVe-Snapmart-PRD-01c881c32-4ec0a981";
const clientSecret = "PRD-1c881c324ede-e1e6-48a9-a547-88b6";
const redirectUri = "Lalith_Vedium-LalithVe-Snapma-ndspmu"; // Ensure this matches exactly what you registered
const authorizationCode = authCode;

const encodedCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
  "base64"
);

const url = "https://api.ebay.com/identity/v1/oauth2/token"; // Production URL

const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Basic ${encodedCredentials}`,
};

const body = new URLSearchParams({
  grant_type: "authorization_code",
  code: authorizationCode,
  redirect_uri: redirectUri, 
});

const options = {
  method: "POST",
  headers: headers,
  body: body.toString(),
};

const proxyAgent = new Agent({
  connect: {
    timeout: 5000, // Timeout in milliseconds
  },
  dispatcher: new ProxyAgent("http://your-proxy-address:port"),
});



fetch(url, options ,{agent : proxyAgent})
  .then((response) => {
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${text}`
        );
      });
    }
    return response.json();
  })
  .then((data) => {
    console.log("Access Token:", data.access_token);
    console.log("Token Response:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
