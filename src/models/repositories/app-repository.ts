import { firestore } from 'firebase/app';
import 'firebase/firestore';

export function db(): firestore.Firestore {
  return firestore();
}

export function writeBatch(): firestore.WriteBatch {
  return db().batch();
}