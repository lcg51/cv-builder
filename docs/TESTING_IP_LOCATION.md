# Testing IP Location in Development Environment

This guide shows you how to test the IP location detection feature while developing locally.

## 🎯 Problem

In development, you typically get local IP addresses (127.0.0.1, 192.168.x.x) which don't have geographical data. Here's how to test location features properly.

## 🛠️ Method 1: Environment Variables (Recommended)

### Step 1: Create .env.local

Add these variables to your `.env.local` file:

```bash
# Enable IP mocking for development testing
MOCK_IP_ENABLED=true

# Choose a test location (options: new-york, london, tokyo, sydney, local)
MOCK_IP_LOCATION=london
```

### Step 2: Restart your development server

```bash
pnpm dev
```

### Step 3: Test

Visit your app and check the console. You should see:

```
[DEV] Mocking IP location: london { ip: '1.1.1.1', location: { country: 'United Kingdom', ... } }
```

## 🌍 Available Test Locations

| Location   | IP            | Country        | City     |
| ---------- | ------------- | -------------- | -------- |
| `new-york` | 8.8.8.8       | United States  | New York |
| `london`   | 1.1.1.1       | United Kingdom | London   |
| `tokyo`    | 202.12.27.33  | Japan          | Tokyo    |
| `sydney`   | 203.206.40.1  | Australia      | Sydney   |
| `local`    | 192.168.1.100 | Local Network  | Local    |

## 🧪 Method 2: Testing Helper Component

Add the testing helper to any page:

```tsx
import { IPTestingHelper } from '@/app/components/IPTestingHelper';

export default function TestPage() {
	return <IPTestingHelper />;
}
```

This component provides:

-   Direct API testing
-   External IP lookup
-   Header inspection
-   Real-time results

## 🌐 Method 3: Use Different Networks

### Mobile Hotspot

```bash
# Connect your laptop to mobile hotspot
# This gives you a different public IP
```

### VPN Service

```bash
# Use any VPN service to simulate different locations
# ExpressVPN, NordVPN, etc.
```

### Different WiFi Networks

```bash
# Test on different networks (coffee shop, office, home)
# Each may have different public IPs
```

## 🚀 Method 4: Deploy to Test Real Environment

### Quick Deploy to Vercel

```bash
# Push to GitHub and deploy
vercel --prod

# Or use staging environment
vercel --target staging
```

### Test on Deployed Version

```bash
# Visit your deployed app
https://your-app.vercel.app

# Check real IP detection
```

## 🔧 Method 5: Manual API Testing

### Test the API Endpoint Directly

```bash
# Basic IP info
curl http://localhost:3000/api/user-ip

# Detailed geo info
curl http://localhost:3000/api/user-ip?detailed=true
```

### Using Browser DevTools

1. Open DevTools → Network tab
2. Visit your app
3. Look for `/api/user-ip` request
4. Check the response data
5. Inspect request headers

## 📊 Debugging Tips

### Check Console Logs

With `MOCK_IP_ENABLED=true`, you'll see:

```
[DEV] Using mocked IP for testing: 1.1.1.1
[DEV] Using mocked geo data: { country: 'United Kingdom', ... }
[IPProvider] IP detected: { ip: '1.1.1.1', isLocal: false, ... }
```

### Verify Component State

Add temporary logging to components:

```tsx
const location = useAppLocation();
console.log('Current location:', location);
```

### Check Network Requests

-   Monitor `/api/user-ip` calls in DevTools
-   Look for `__mocked: true` in responses
-   Verify geographical data is present

## 🔄 Switching Test Locations

### Method A: Environment Variable

```bash
# In .env.local
MOCK_IP_LOCATION=tokyo
# Restart dev server
```

### Method B: Modify Config File

```typescript
// In src/lib/dev-ip-config.ts
export const DEV_CONFIG = {
	mockingEnabled: true,
	activeTestIP: 'sydney', // Change this
	debugMode: true
};
```

## 📱 Real User Testing

### Get Feedback from Users

```bash
# Share your deployed app
# Ask users to test from different locations
# Check analytics/logs for real IP data
```

### Use Analytics

```bash
# Monitor real user IPs in production
# Check geographical distribution
# Verify location accuracy
```

## ⚡ Quick Test Commands

```bash
# Enable mocking with London IP
echo "MOCK_IP_ENABLED=true\nMOCK_IP_LOCATION=london" >> .env.local

# Test API directly
curl "http://localhost:3000/api/user-ip?detailed=true"

# Check your real public IP
curl https://ipapi.co/json/
```

## 🐛 Troubleshooting

### Mock Data Not Working

1. Check `.env.local` file exists and has correct values
2. Restart development server after changes
3. Check console for `[DEV]` log messages
4. Verify `process.env.NODE_ENV === 'development'`

### No Geographical Data

1. Ensure `detailed=true` in API calls
2. Check if IP is detected as local (`isLocal: true`)
3. Verify external API (ipapi.co) is accessible
4. Check for API rate limits

### Location Not Updating

1. Clear browser cache
2. Check if data is cached (10-minute default)
3. Use "Refresh" button in components
4. Force refresh with `refetch()` function

## 📋 Testing Checklist

-   [ ] Local IP detection (127.0.0.1, 192.168.x.x)
-   [ ] Public IP with geographical data
-   [ ] Different countries/cities
-   [ ] Error handling (network failures)
-   [ ] Loading states
-   [ ] Cache behavior
-   [ ] Mobile vs desktop
-   [ ] Different browsers
-   [ ] Production deployment

## 💡 Pro Tips

1. **Use Mock Data First**: Start with environment variables for quick testing
2. **Test Edge Cases**: Try invalid IPs, network errors, rate limits
3. **Monitor Performance**: Check API response times and caching
4. **Real User Testing**: Deploy early and get feedback from different locations
5. **Gradual Rollout**: Use feature flags to control IP detection

Happy testing! 🚀
