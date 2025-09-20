// Shared Firebase Configuration
// firebase-config.ts

import { FirebaseConfig } from 'jovjrx-pagebuilder'

export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// Validate configuration
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
)

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
    'Please check your .env.local file and ensure all Firebase configuration variables are set.'
  )
}

// Optional: Firebase Auth configuration (if using authentication)
export const authConfig = {
  // Configure sign-in methods
  signInOptions: [
    'google.com',
    'password',
  ],
  // Configure callbacks
  callbacks: {
    signInSuccessWithAuthResult: () => {
      // Redirect to editor after successful login
      window.location.href = '/admin'
      return false
    },
  },
}

// Optional: Firestore settings
export const firestoreSettings = {
  // Enable offline persistence
  enablePersistence: true,
  // Configure cache settings
  cacheSizeBytes: 40 * 1024 * 1024, // 40 MB
}
