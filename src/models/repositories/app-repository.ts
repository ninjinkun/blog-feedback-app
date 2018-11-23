import * as firebase from 'firebase/app';
import 'firebase/firestore';

export function db(): firebase.firestore.Firestore {
  return firebase.firestore();
}

export function writeBatch(): firebase.firestore.WriteBatch {
  return db().batch();
}
