# Exam Results App — Full Flow (Student Creation → Login → Results)

## 1. Admin Creates Student

Admin opens app → "Manage Students" → "Add Student"
Fills form: firstName, lastName, registrationNumber, **email**, phone, department, address
Submits → document created in `students` collection with auto-generated ID

```
students/{studentDocId}
{
  firstName: "Amina",
  lastName: "Mohamed",
  registrationNumber: "STD-001",
  email: "amina@example.com",      ← KEY FIELD for auto-linking
  phone: "0700000000",
  department: "Computer Science",
  address: "Dar es Salaam",
  userId: null,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

## 2. Admin Creates Firebase Auth Account

Firebase Console → Authentication → Add User
Use the **same email** as the student document: `amina@example.com`
Set a password

## 3. Student Logs In (First Time)

App.tsx: `onAuthStateChanged` fires → calls `handleAuthenticatedUser()`

### Step A — Check/Create users doc

Reads `users/{firebaseAuthUid}`

**Not found** → auto-creates:

```
users/{firebaseAuthUid}
{
  email: "amina@example.com",
  role: "student",                ← DEFAULT role (change to "admin" in Console)
  studentId: null,
  createdAt: serverTimestamp()
}
```

**Found** → reads existing data

### Step B — Auto-Link Student (if studentId is null)

Checks if `studentId` is null → queries Firestore:

```
Query: students WHERE email == "amina@example.com"
```

**Match found** → updates `users/{uid}`:

```
users/{firebaseAuthUid}
{
  ...,
  studentId: "abc123..."   ← student's Firestore document ID
}
```

**No match** → studentId stays null (student has no profile yet)

### Step C — Set Zustand State

```
useAuthStore state:
{
  user: FirebaseUser,
  role: "student",
  studentId: "abc123...",   ← or null if unl linked
}
```

## 4. Student Views Results

Student Dashboard → "My Results"

`StudentResultsScreen` reads `studentId` from `useAuthStore`
Queries:

```
results WHERE studentId == "abc123..." AND published == true
```

Displays: course name, score, grade, GPA

## 5. Subsequent Logins

`onAuthStateChanged` fires → `handleAuthenticatedUser()`

Step A: `users/{uid}` **already exists** → reads data directly
Step B: `studentId` **already set** → skips query, goes to Step C
Step C: Sets Zustand state immediately → student sees dashboard

## Data Relationships

```
Firebase Auth Account (uid: "authUid123")
       │
       ▼
users/{authUid123}           ← doc ID = Firebase Auth UID
  ├─ email: "amina@example.com"
  ├─ role: "student"
  └─ studentId: "studentDoc456"
                         │
students/{studentDoc456}  ◄── matched by email on first login
  ├─ email: "amina@example.com"
  ├─ firstName: "Amina"
  └─ lastName: "Mohamed"

results/resultDoc789
  ├─ studentId: "studentDoc456"   ← links to students document
  ├─ courseId: "courseDoc101"
  ├─ score: 85
  └─ published: true
```

## Admin Setup

To make yourself admin: Firebase Console → `users` collection → find your UID doc → change `role` from `"student"` to `"admin"`

## clone the repo

```bash
git clone https://github.com/Abdibasid-Moh-aden0005/Mobile-Exam-Result-App
```

## install dependencies

```bash
cd exam-results-app
npm install
```

## run the app

```bash
npx expo start -c
```
