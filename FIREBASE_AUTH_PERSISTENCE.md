# Firebase Auth Persistence in React Native

## The Problem

By default, `getAuth(app)` in Firebase uses **in-memory persistence**. This means Firebase does NOT save the user's authentication token anywhere on the device. When the app restarts, Firebase has no memory of who was logged in.

## Timeline Without Persistence (`getAuth(app)`)

```
Time 0ms:  App mounts
           → onAuthStateChanged listener is registered
           → Firebase internally checks: "do I have a saved session?"
           → Since persistence is in-memory only, Firebase says:
             "I have nothing saved. Report: no user."
           → onAuthStateChanged fires with firebaseUser = null
           → App shows LoginScreen (FLASH!)

Time ~500-2000ms (depends on network):
           → Firebase sends a network request to the server:
             "Is there still a valid auth token for this device?"
           → If yes → onAuthStateChanged fires again with firebaseUser = {...}
           → App switches to the correct screen (AdminDashboard or StudentDashboard)
```

The result: **every cold start shows a brief flash of the login screen** before settling on the correct screen. This happens even when the user never logged out.

## Timeline With Persistence (`initializeAuth` + `getReactNativePersistence`)

```js
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const persistence = getReactNativePersistence(ReactNativeAsyncStorage);
export const auth = initializeAuth(app, { persistence });
```

```
Time 0ms:  App mounts
           → onAuthStateChanged listener is registered
           → Firebase checks AsyncStorage → finds a cached token
           → onAuthStateChanged fires with firebaseUser = {...} (INSTANTLY!)
           → App shows AdminDashboard or StudentDashboard (no flash)

In background:
           → Firebase verifies the token with the server
           → If the token expired → onAuthStateChanged fires with null
           → App switches to LoginScreen (only if session truly expired)
```

No flash. The correct screen shows immediately on cold start.

## Two Separate Things Stored in AsyncStorage

This app stores **two independent pieces of data** in AsyncStorage:

| What | Key | Who manages it | Purpose |
|------|-----|----------------|---------|
| Auth token | (Firebase internal key) | `initializeAuth` + `getReactNativePersistence` | Proves the user is authenticated |
| App data | `"userData"` | `authStore.js` — `restoreSession()` / `handleAuthenticatedUser()` | Stores uid, email, role, studentId for navigation & app logic |

**Both are needed:**
- Firebase's persisted token ensures `onAuthStateChanged` fires with the user immediately (no network delay).
- The store's `restoreSession()` ensures the app knows the user's `role` (admin vs student) instantly for correct navigation.

Without #1, Firebase fires `null` first and needs a network call. Without #2, the store doesn't know the role and the app can't decide which stack to show.

## Key Files

- `firebase/firebaseConfig.js` — Firebase initialization with AsyncStorage persistence
- `src/stores/authStore.js` — `handleAuthenticatedUser` saves to AsyncStorage; `restoreSession` reads from it
- `App.js` — calls `restoreSession()` on mount and listens to `onAuthStateChanged`
