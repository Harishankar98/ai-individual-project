import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import firebaseConfig from '../config/firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Auth service functions
export const authService = {
    // Sign up with email and password
    signUp: async (email: string, password: string, displayName?: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name if provided
            if (displayName && userCredential.user) {
                await updateProfile(userCredential.user, { displayName });
            }

            // Send verification email
            if (userCredential.user) {
                await sendEmailVerification(userCredential.user);
            }

            return {
                success: true,
                user: userCredential.user,
                message: 'Account created successfully! Please check your email for verification.'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.code,
                message: getErrorMessage(error.code)
            };
        }
    },

    // Sign in with email and password
    signIn: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return {
                success: true,
                user: userCredential.user,
                message: 'Signed in successfully!'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.code,
                message: getErrorMessage(error.code)
            };
        }
    },

    // Sign in with Google
    signInWithGoogle: async () => {
        try {
            // Configure Google Provider with additional settings
            googleProvider.setCustomParameters({
                prompt: 'select_account'
            });

            console.log('Attempting Google sign-in...');
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Google sign-in successful:', result.user.email);

            return {
                success: true,
                user: result.user,
                message: 'Signed in with Google successfully!'
            };
        } catch (error: any) {
            console.error('Google sign-in error details:', {
                code: error.code,
                message: error.message,
                email: error.customData?.email,
                credential: error.credential
            });

            return {
                success: false,
                error: error.code,
                message: getErrorMessage(error.code)
            };
        }
    },

    // Sign out
    logout: async () => {
        try {
            await signOut(auth);
            return {
                success: true,
                message: 'Signed out successfully!'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.code,
                message: 'Failed to sign out. Please try again.'
            };
        }
    },

    // Send password reset email
    resetPassword: async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return {
                success: true,
                message: 'Password reset email sent! Check your inbox.'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.code,
                message: getErrorMessage(error.code)
            };
        }
    },

    // Get current user
    getCurrentUser: () => {
        return auth.currentUser;
    },

    // Auth state observer
    onAuthStateChange: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    }
};

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'No account found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed. Please try again.';
        case 'auth/popup-blocked':
            return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
        case 'auth/cancelled-popup-request':
            return 'Sign-in was cancelled. Please try again.';
        case 'auth/unauthorized-domain':
            return 'This domain is not authorized for Google sign-in. Please contact support.';
        case 'auth/operation-not-allowed':
            return 'Google sign-in is not enabled. Please contact support.';
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with the same email but different sign-in credentials.';
        case 'auth/invalid-credential':
            return 'The credential is invalid or has expired. Please try again.';
        case 'auth/operation-not-supported-in-this-environment':
            return 'This operation is not supported in this environment. Make sure you are using HTTPS.';
        case 'auth/timeout':
            return 'The operation timed out. Please try again.';
        default:
            console.error('Unhandled error code:', errorCode);
            return 'An error occurred. Please try again.';
    }
};

export { auth };
export default authService;
