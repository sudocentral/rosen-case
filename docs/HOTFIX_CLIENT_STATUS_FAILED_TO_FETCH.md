# HOTFIX: Client Center /c/status "Failed to fetch"

**Date:** 2026-01-10
**Severity:** High
**Prepared By:** Claude (Assistant Developer)

---

## Root Cause

**The `x-intake-token` header was NOT included in the API server's CORS `allowedHeaders` configuration.**

When the browser sends a preflight OPTIONS request with `Access-Control-Request-Headers: x-intake-token`, the server returns `Access-Control-Allow-Headers` WITHOUT `x-intake-token`. The browser then blocks the actual GET request, resulting in "Failed to fetch".

---

## Investigation Details

### Browser Error (Reproduced)
- **Page:** https://stage.rosenexperts.com/c/status
- **Error displayed:** "Unable to Load Status" / "Failed to fetch"
- **Console error:** CORS policy violation - header not allowed

### Request Details
- **URL:** https://api.sudomanaged.com/api/rosen/public/client/status
- **Method:** GET
- **Header:** x-intake-token: <token>
- **Status:** Blocked by CORS (preflight failed)

### CORS Preflight Response (BEFORE FIX)
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://stage.rosenexperts.com
Access-Control-Allow-Headers: Content-Type,Authorization,X-Requested-With,X-HMAC-Signature,X-Request-ID,x-sudo-timestamp,x-sudo-signature,x-sudo-tenant-id,x-sudo-product-id,x-request-id,x-user-sub,x-user-groups,x-correlation-id,x-charles-api-version
                              ^^^ x-intake-token MISSING ^^^
```

### API Endpoint Test (Direct curl - works)
```bash
$ curl -i https://api.sudomanaged.com/api/rosen/public/client/status -H "x-intake-token: invalid"
HTTP/1.1 401 Unauthorized
{"success":false,"error":"Invalid token","code":"INVALID_TOKEN"}
```

The endpoint WORKS when called directly (no CORS). The issue is strictly browser CORS enforcement.

---

## Changes Made

### 1. API Server CORS Configuration
**File:** `/var/shared-modules/api/index.js`
**Line:** 44

**Before:**
```javascript
allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-HMAC-Signature", "X-Request-ID", "x-sudo-timestamp", "x-sudo-signature", "x-sudo-tenant-id", "x-sudo-product-id", "x-request-id", "x-user-sub", "x-user-groups", "x-correlation-id", "x-charles-api-version"],
```

**After:**
```javascript
allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-HMAC-Signature", "X-Request-ID", "x-sudo-timestamp", "x-sudo-signature", "x-sudo-tenant-id", "x-sudo-product-id", "x-request-id", "x-user-sub", "x-user-groups", "x-correlation-id", "x-charles-api-version", "x-intake-token"],
```

### 2. Frontend Error Handling Improved
**File:** `/var/www/rosenexperts-app/apps/marketing/src/app/c/status/page.tsx`

**Before:**
```javascript
catch (err) {
  setError(err instanceof Error ? err.message : "Could not load your case status.");
}
```

**After:**
```javascript
catch (err) {
  const errorMsg = err instanceof Error ? err.message : "Could not load your case status.";
  if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
    setError("Unable to connect to our servers. Please check your internet connection and try again.");
  } else if (errorMsg.includes("401") || errorMsg.includes("Unauthorized")) {
    localStorage.removeItem("rosen_client_token");
    localStorage.removeItem("rosen_case_id");
    setError("Your session has expired. Please request a new access link.");
  } else {
    setError(errorMsg);
  }
}
```

---

## Curl Proofs

### A) Invalid Token (Expected: 401)
```bash
$ curl -i https://api.sudomanaged.com/api/rosen/public/client/status -H "x-intake-token: invalid"

HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8
{"success":false,"error":"Invalid token","code":"INVALID_TOKEN"}
```
**Result:** PASS - Endpoint returns proper 401 with JSON error

### B) CORS Preflight (Before PM2 restart - still missing x-intake-token)
```bash
$ curl -i -X OPTIONS https://api.sudomanaged.com/api/rosen/public/client/status \
  -H "Origin: https://stage.rosenexperts.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: x-intake-token, content-type"

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://stage.rosenexperts.com
Access-Control-Allow-Headers: [old list without x-intake-token]
```

---

## Action Required

### JAMES MUST DO:
```bash
ssh -i ~/.ssh/claude ubuntu@api.sudomanaged.com 'pm2 restart shared-modules-api'
```

After PM2 restart, the CORS preflight will include `x-intake-token` in `Access-Control-Allow-Headers`.

---

## Verification Steps (After PM2 Restart)

1. Run CORS preflight test:
```bash
curl -i -X OPTIONS https://api.sudomanaged.com/api/rosen/public/client/status \
  -H "Origin: https://stage.rosenexperts.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: x-intake-token"
```
**Expected:** `Access-Control-Allow-Headers` should now include `x-intake-token`

2. Test in browser:
   - Open https://stage.rosenexperts.com/c/status
   - Should either load status (if valid token in localStorage) or redirect to /start (if no token)
   - No more "Failed to fetch" error

---

## Summary

| Item | Status |
|------|--------|
| Root cause identified | CORS allowedHeaders missing x-intake-token |
| API fix applied | /var/shared-modules/api/index.js modified |
| Frontend error handling improved | Better messages for network/auth errors |
| Frontend deployed | stage.rosenexperts.com updated |
| PM2 restart required | **PENDING - James action needed** |

---

*Report generated by Claude (Assistant Developer)*
