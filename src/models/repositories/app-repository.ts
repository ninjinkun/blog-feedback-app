import {
  FieldValue,
  Firestore,
  WriteBatch,
  getFirestore,
  serverTimestamp as firestoreServerTimestamp,
  writeBatch as firestoreWriteBatch,
} from 'firebase/firestore';

export function db(): Firestore {
  return getFirestore();
}

export function serverTimestamp(): FieldValue {
  return firestoreServerTimestamp();
}

export function writeBatch(): WriteBatch {
  return firestoreWriteBatch(db());
}
