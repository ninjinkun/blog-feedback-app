import { db } from './app-repository';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export function userRef(userId: string): firebase.firestore.DocumentReference {
  return db().collection('users').doc(userId);
}
