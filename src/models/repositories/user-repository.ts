import { DocumentReference, doc } from 'firebase/firestore';

import { db } from './app-repository';

export function userRef(userId: string): DocumentReference {
  return doc(db(), 'users', userId);
}
