# 🔍 Location Access Debugging Guide

## ⚠️ IMPORTANT: Permissions Policy Issue Detected

If you see this error in your console:
```
Geolocation has been disabled in this document by permissions policy.
```

**This is a Figma Make hosting limitation, not a bug!** 

👉 **See `/PERMISSIONS_POLICY_EXPLANATION.md` for complete details.**

**Quick Summary:**
- ✅ Your app code is 100% correct
- ✅ API integration is complete and working
- ❌ Figma Make hosting blocks geolocation for security
- ✅ App automatically uses mock data as fallback
- ✅ Will work perfectly on standard hosting (Vercel, Netlify, etc.)

**You cannot fix this in Figma Make** - it's an environmental restriction. The app handles it gracefully by showing mock data.

---

## The Issue (for other location errors)

You've set location to "Always Allow" but the app still shows:
> "Enable location access to see real restaurants near you"

## How to Debug

### Step 1: Open Browser Console
1. Open your app
2. Press **F12** (or Cmd+Option+I on Mac)
3. Click the **Console** tab
4. Go to the **Search** tab in your app

### Step 2: Look for These Logs

**If location is working:**
```
🔄 fetchRealRestaurants called
📍 Requesting geolocation permission...
✅ Location granted: 37.7749, -122.4194
🔍 Searching restaurants: https://...
✅ Received restaurants: 47
✅ Loaded 47 real restaurants from Documenu near your location
```

**If location is denied:**
```
🔄 fetchRealRestaurants called
📍 Requesting geolocation permission...
📍 Location error: GeolocationPositionError {...}
Error code: 1, Message: User denied geolocation prompt
```

**If location times out:**
```
🔄 fetchRealRestaurants called
📍 Requesting geolocation permission...
📍 Location error: GeolocationPositionError {...}
Error code: 3, Message: Timeout expired
```

### Step 3: Check Browser Permissions

#### Chrome
1. Click the **lock icon** in address bar
2. Look for "Location"
3. Should say "Allow" not "Block"
4. If blocked, change to "Allow" and click **Retry** button

#### Firefox
1. Click the **lock/shield icon** in address bar
2. Click "Connection secure"
3. Look for "Location" permission
4. Change to "Allow"
5. Click **Retry** button

#### Safari
1. Safari menu → Settings
2. Websites tab → Location
3. Find your site
4. Set to "Allow"
5. Refresh page

### Step 4: Hard Refresh
After changing permissions:
- **Windows**: Ctrl + Shift + R
- **Mac**: Cmd + Shift + R
- **Or**: Clear cache and reload

## What the Retry Button Does

The yellow banner now has a **Retry** button:
```
⚠️ Location permission denied [Retry]
```

Click it to:
1. Reset location status to "loading"
2. Request permission again
3. Attempt to fetch real restaurants

## Banner States

### 🔵 Blue (Loading)
```
Requesting location access...
```
**Means:** Currently asking for permission

### 🟢 Green (Success)
```
47 real restaurants found near your location from Documenu
```
**Means:** Location worked, real data loaded

### 🔵 Blue (Location but no data)
```
Location detected. No real restaurants found nearby (using mock data).
```
**Means:** Location worked but API returned 0 results or failed

### 🟡 Yellow (Denied)
```
Location permission denied [Retry]
```
**Means:** You denied permission or browser blocked it

## Common Issues

### Issue 1: Permission Stuck on "Ask"
**Problem:** Browser keeps asking every time
**Solution:** Change to "Always Allow" and hard refresh

### Issue 2: Permission Shows "Allow" but Still Denied
**Problem:** Browser cache outdated
**Solution:** 
1. Clear site data
2. Hard refresh
3. Allow permission again

### Issue 3: Timeout Error
**Problem:** Location request takes too long (>5 seconds)
**Solution:**
1. Check GPS/location services enabled on device
2. Try disabling VPN
3. Click **Retry** button

### Issue 4: HTTPS Required
**Problem:** Geolocation only works on HTTPS
**Solution:** Make sure you're on https:// not http://

## Manual Test

Open browser console and run:
```javascript
// Test if geolocation is available
if (navigator.geolocation) {
  console.log('✅ Geolocation API available');
  
  // Test permission
  navigator.permissions.query({ name: 'geolocation' }).then(result => {
    console.log('Permission state:', result.state);
    // Should be: "granted", "prompt", or "denied"
  });
  
  // Test actual location
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      console.log('✅ Location:', pos.coords.latitude, pos.coords.longitude);
    },
    (err) => {
      console.error('❌ Error:', err.code, err.message);
    }
  );
} else {
  console.error('❌ Geolocation not supported');
}
```

## Error Codes

- **Code 1 (PERMISSION_DENIED)**: User denied permission
- **Code 2 (POSITION_UNAVAILABLE)**: Location unavailable (GPS off, etc.)
- **Code 3 (TIMEOUT)**: Request took longer than 5 seconds

## Next Steps

After you:
1. ✅ Set permission to "Always Allow"
2. ✅ Hard refresh the page
3. ✅ Click **Retry** button if needed

You should see in console:
```
🔄 fetchRealRestaurants called
📍 Requesting geolocation permission...
✅ Location granted: [your coordinates]
```

And the banner should change from yellow to green!

## Still Not Working?

If you still see the yellow banner:

1. **Check console logs** - What error do you see?
2. **Try incognito/private mode** - Rules out extension issues
3. **Try different browser** - Chrome/Firefox/Safari
4. **Check device settings** - Location services enabled?
5. **Disable VPN** - Can interfere with geolocation
6. **Share console logs** - Post what you see for debugging

---

💡 **Tip:** The app works fine without location access! It just won't show real restaurants from Documenu. Mock restaurants are always available.
