# Algol Mobile Admin (Scaffold)

Minimal Expo/React Native scaffold for Phase 10 mobile admin.

## Quick start
1. Install Expo CLI: `npm i -g expo-cli`
2. From `mobile-admin/`: `npm install`
3. Run: `npm start` (use Expo Go or simulator)

## Screens
- `App.tsx` with a starter screen; add auth flow against your Next.js admin APIs.
- Use secure storage for tokens and reuse RBAC endpoints as needed.

## Next Steps
- Implement sign-in with your NextAuth credentials via an API bridge.
- Add tabs for Orders, Inventory, and Alerts consuming existing admin APIs.
- Wire push notifications using Expo Notifications tied to the admin notifications feed.
