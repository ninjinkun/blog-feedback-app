import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export function db(): firebase.firestore.Firestore {
  return firebase.firestore();
}

export function serverTimestamp(): firebase.firestore.FieldValue {
  return firebase.firestore.FieldValue.serverTimestamp();
}

export function writeBatch(): firebase.firestore.WriteBatch {
  return db().batch();
}
