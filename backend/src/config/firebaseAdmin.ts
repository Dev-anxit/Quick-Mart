import * as admin from 'firebase-admin';

let isInitialized = false;

// Try initializing Firebase Admin
try {
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (serviceAccountVar) {
    const serviceAccount = JSON.parse(serviceAccountVar);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    isInitialized = true;
    console.log("✅ Firebase Admin initialized with service account");
  } else if (projectId && !projectId.includes("demo") && !projectId.includes("test")) {
    admin.initializeApp({
      projectId,
    });
    isInitialized = true;
    console.log(`✅ Firebase Admin initialized with project ID: ${projectId}`);
  } else {
    console.warn("⚠️ Firebase Admin credentials not found or set to demo. Google Auth will run in mock mode.");
  }
} catch (error) {
  console.error("⚠️ Failed to initialize Firebase Admin:", error instanceof Error ? error.message : error);
}

export interface DecodedFirebaseUser {
  uid: string;
  email?: string;
  name?: string;
  phone?: string;
  picture?: string;
}

/**
 * Verify a Firebase ID token.
 * In development/demo environments, supports mock tokens starting with "mock-google-token-".
 */
export async function verifyFirebaseIdToken(token: string): Promise<DecodedFirebaseUser | null> {
  // Support mock tokens for dev mode
  if (token.startsWith("mock-google-token-")) {
    const mockUid = token.replace("mock-google-token-", "");
    return {
      uid: `google_${mockUid}`,
      email: `${mockUid}@gmail.com`,
      name: `${mockUid.charAt(0).toUpperCase() + mockUid.slice(1)} User`,
      picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150",
    };
  }

  if (!isInitialized) {
    if (process.env.NODE_ENV === "development") {
      // Bypassing real check in dev mode if firebase admin is not initialized
      console.warn("⚠️ Firebase Admin not initialized. Accepting token as mock in development mode.");
      return {
        uid: "google_demo_12345",
        email: "demo_user@gmail.com",
        name: "Demo User",
      };
    }
    throw new Error("Firebase Admin is not initialized.");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      phone: decodedToken.phone_number,
      picture: decodedToken.picture,
    };
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return null;
  }
}
