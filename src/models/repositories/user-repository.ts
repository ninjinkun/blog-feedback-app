import firebase from 'firebase/app';
import { db } from './app-repository';

export function userRef(userId: string): firebase.firestore.DocumentReference {
  return db().collection('users').doc(userId);
}
