
const clientId = "LalithVe-Snapmart-PRD-01c881c32-4ec0a981";
const redirectUri = "Lalith_Vedium-LalithVe-Snapma-ndspmu"; 
const scopes = [
  'https://api.ebay.com/oauth/api_scope' ,'https://api.ebay.com/oauth/api_scope/sell.marketing.readonly'

]; // Add other scopes if needed
const state = "123456"; 

// Construct the production authorization URL
const authUrl = `https://auth.ebay.com/oauth2/authorize?client_id=${encodeURIComponent(
  clientId
)}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&response_type=code&scope=${encodeURIComponent(scopes.join(" "))}`;
console.log(authUrl);


console.log(
  "Open this URL in your browser to get the authorization code for production:"
);
console.log(authUrl);
