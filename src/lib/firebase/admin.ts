import { app, db, auth } from './firebase';

/**
 * Server/Admin helper module prepared for server-side execution context.
 */
export const firebaseAdmin = {
  app,
  db,
  auth,
};
