import { firestore } from 'firebase/app';

export function db(): firestore.Firestore {
  return firestore();
}

export function serverTimestamp(): firestore.FieldValue {
  return firestore.FieldValue.serverTimestamp();
}

export function writeBatch(): firestore.WriteBatch {
  return db().batch();
}
