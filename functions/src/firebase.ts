
import * as admin from 'firebase-admin';

admin.initializeApp();
export const db = admin.firestore();
db.settings({
  timestampsInSnapshots: true
});
