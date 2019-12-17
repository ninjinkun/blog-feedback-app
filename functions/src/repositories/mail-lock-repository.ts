
import { firestore } from 'firebase-admin';
import { db } from '../firebase';
import { WriteResult } from '@google-cloud/firestore';

export interface MailLock {
    taskUUID: string;
}
  
export function createMailLock(uuid: string, taskUUID: string): Promise<WriteResult> {
    return db.collection('daily-mail-lock').doc(uuid).create({
        taskUUID,
        timestamp: firestore.FieldValue.serverTimestamp(),
    });
}

export async function getMailLock(uuid: string): Promise<MailLock|undefined>  {
    const doc = await db.collection('daily-mail-lock').doc(uuid).get();
    if (doc.exists) {
        return doc.data() as MailLock;
    } else {
        return undefined;
    }
}