import { auth } from './firebase';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';

/**
 * Ensures client is authenticated (anonymously if not logged in).
 * Essential for Firestore security rule evaluations.
 */
export async function ensureAuthenticatedUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      } else {
        try {
          const userCred = await signInAnonymously(auth);
          unsubscribe();
          resolve(userCred.user);
        } catch (error) {
          console.warn('Anonymous auth initialization warning:', error);
          unsubscribe();
          resolve(null);
        }
      }
    });
  });
}
