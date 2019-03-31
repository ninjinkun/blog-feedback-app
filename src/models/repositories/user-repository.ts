import { firestore } from 'firebase/app';
import { db } from './app-repository';

export function userRef(userId: string): firestore.DocumentReference {
  return db()
    .collection('users')
    .doc(userId);
}
