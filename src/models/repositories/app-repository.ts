import { firestore } from 'firebase';

export function db(): firestore.Firestore {
  return firestore();
}

export function writeBatch(): firestore.WriteBatch {
  return db().batch();
}