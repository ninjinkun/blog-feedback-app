
import { initializeApp, firestore } from 'firebase-admin';

initializeApp();
export const db = firestore();
db.settings({
  timestampsInSnapshots: true
});
