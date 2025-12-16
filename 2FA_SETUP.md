# Two-Factor Authentication (2FA) System

## Overview
Enterprise-grade 2FA implementation for admin accounts using TOTP (Time-based One-Time Password) standard.

## Features
- ✅ TOTP-based authentication (compatible with Google Authenticator, Authy, 1Password, etc.)
- ✅ QR code generation for easy setup
- ✅ Manual secret key entry option
- ✅ 2FA verification during login
- ✅ Enable/disable 2FA functionality
- ✅ Protected admin routes
- ✅ User-friendly UI with error handling

## How It Works

### 1. **Admin Enables 2FA**
   - Admin logs in normally
   - Navigates to `/admin/security`
   - Clicks "Enable 2FA"
   - Scans QR code with authenticator app
   - Enters 6-digit code to verify and activate

### 2. **Login with 2FA**
   - Admin enters email and password
   - System detects 2FA is enabled
   - Additional input field appears for 6-digit code
   - Admin enters current TOTP code from authenticator app
   - Access granted if code is valid

### 3. **Disable 2FA**
   - Admin navigates to `/admin/security`
   - Enters current 2FA code
   - Clicks "Disable 2FA"
   - 2FA is removed from account

## Security Features

### Multi-Layer Protection
1. **Middleware Protection** (`middleware.ts`)
   - Blocks unauthorized access at edge
   - Validates JWT tokens before route execution
   - Returns 403 for unauthorized API calls

2. **Layout Protection** (`app/admin/layout.tsx`)
   - Server-side authentication check
   - Role verification (ADMIN only)
   - Redirects non-admin users

3. **2FA Verification** (`lib/auth.ts`)
   - TOTP token validation during login
   - 2-step time window for clock drift tolerance
   - Secure secret storage

### Token Security
- **TOTP Algorithm**: RFC 6238 compliant
- **Secret Storage**: Encrypted in database
- **Time Window**: ±60 seconds tolerance
- **Code Length**: 6 digits
- **Validity**: 30-second intervals

## API Endpoints

### Setup 2FA
```
POST /api/admin/2fa/setup
```
- Generates secret and QR code
- Stores secret (not enabled yet)
- Returns QR code as base64 data URL

### Verify and Enable 2FA
```
POST /api/admin/2fa/verify
Body: { "token": "123456" }
```
- Verifies TOTP token
- Enables 2FA on account
- Returns success confirmation

### Disable 2FA
```
POST /api/admin/2fa/disable
Body: { "token": "123456" }
```
- Requires valid TOTP token
- Disables 2FA and removes secret
- Returns success confirmation

### Check 2FA Status
```
GET /api/admin/2fa/status
```
- Returns current 2FA status
- Response: { "enabled": true/false }

### Login Verification
```
POST /api/auth/verify-2fa
Body: { "email": "...", "password": "...", "token": "123456" }
```
- Standalone verification endpoint
- Validates credentials + 2FA token
- Returns success/failure

## Database Schema

```prisma
model User {
  id               String   @id @default(cuid())
  email            String   @unique
  password         String?
  role             String   @default("user")
  twoFactorEnabled Boolean  @default(false)
  twoFactorSecret  String?  // Base32-encoded TOTP secret
  // ... other fields
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install speakeasy qrcode @types/speakeasy @types/qrcode
```

### 2. Run Migration
```bash
npx prisma migrate dev --name add_two_factor_auth
```

### 3. Update Auth Configuration
The auth provider automatically handles 2FA in `lib/auth.ts`

### 4. Test the System

**Enable 2FA:**
1. Login as admin: `admin@algol.com` / `admin123`
2. Navigate to `http://localhost:3007/admin/security`
3. Click "Enable 2FA"
4. Scan QR code with Google Authenticator
5. Enter the 6-digit code shown in app
6. Click "Verify and Enable"

**Login with 2FA:**
1. Logout
2. Go to login page
3. Enter email and password
4. Additional 2FA field appears
5. Enter current code from authenticator app
6. Click "Sign In"

**Disable 2FA:**
1. Go to `/admin/security`
2. Enter current 2FA code
3. Click "Disable 2FA"

## Supported Authenticator Apps
- Google Authenticator (iOS/Android)
- Microsoft Authenticator
- Authy
- 1Password
- Bitwarden Authenticator
- Any RFC 6238 compliant TOTP app

## Error Handling

| Error | Meaning |
|-------|---------|
| `2FA_REQUIRED` | User has 2FA enabled, code needed |
| `Invalid 2FA code` | TOTP token verification failed |
| `2FA not setup` | Trying to verify before setup complete |
| `Only admins can enable 2FA` | Non-admin trying to enable 2FA |

## Security Best Practices

### ✅ Implemented
- TOTP standard (RFC 6238)
- Secure secret generation
- Time-window tolerance for clock drift
- Server-side verification only
- Protected API routes
- Encrypted database storage

### 🔒 Recommended Additions
- **Backup Codes**: Generate one-time recovery codes
- **Rate Limiting**: Prevent brute force attacks on 2FA codes
- **Audit Logging**: Track 2FA enable/disable events
- **SMS Fallback**: Optional SMS-based 2FA
- **Email Alerts**: Notify when 2FA is disabled
- **Session Management**: Force re-authentication after 2FA changes

## Troubleshooting

### Code Not Working
- Check device time is synced
- Try previous/next code (time drift)
- Verify secret was saved correctly
- Re-scan QR code if needed

### Can't Access Admin
- If 2FA enabled and authenticator lost:
  - Database admin can disable: `UPDATE users SET "twoFactorEnabled" = false WHERE email = 'admin@algol.com'`
  - This is why backup codes are recommended

### Clock Drift Issues
- System uses ±2 time steps (±60 seconds)
- Check server and device time sync
- Use NTP to sync server time

## Testing Checklist

- [ ] Enable 2FA with QR code
- [ ] Enable 2FA with manual secret entry
- [ ] Login with valid 2FA code
- [ ] Login with invalid 2FA code (should fail)
- [ ] Login without 2FA code when required (should fail)
- [ ] Disable 2FA with valid code
- [ ] Disable 2FA with invalid code (should fail)
- [ ] Check 2FA status API
- [ ] Verify middleware protection
- [ ] Test non-admin user cannot enable 2FA
- [ ] Test customer login (no 2FA prompt)

## Production Considerations

1. **Backup Strategy**: Implement recovery codes
2. **Rate Limiting**: Add rate limiting to prevent brute force
3. **Monitoring**: Track failed 2FA attempts
4. **User Education**: Provide setup guides and FAQs
5. **Support Process**: Define account recovery procedures
6. **Compliance**: Ensure meets security requirements (SOC 2, ISO 27001, etc.)

## Future Enhancements

- [ ] Backup recovery codes (10 one-time codes)
- [ ] SMS-based 2FA as alternative
- [ ] Email verification for 2FA changes
- [ ] Remember device for 30 days
- [ ] Biometric authentication integration
- [ ] WebAuthn/FIDO2 support
- [ ] Admin audit log for security events
- [ ] Force 2FA for all admin accounts

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review server logs for error details
3. Verify database schema matches expected structure
4. Test with fresh QR code scan

---

**Security Note**: This implementation follows industry standards (RFC 6238) and uses battle-tested libraries (speakeasy). However, always conduct security audits before production deployment.
