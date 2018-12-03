import * as firebase from '@firebase/testing';
import { auth } from 'firebase';
import fs from 'fs';
import { db as firebaseDB, serverTimestamp, writeBatch } from './models/repositories/app-repository';
import { blogRef, saveBlog } from './models/repositories/blog-repository';
import { saveItemBatch } from './models/repositories/item-repository';
import { userRef } from './models/repositories/user-repository';

const projectIdBase = 'firestore-emulator-example-' + Date.now();
let testNumber = 0;

function getProjectId() {
  return `${projectIdBase}-${testNumber}`;
}

function authedApp(auth?: object) {
  return firebase
    .initializeTestApp({
      projectId: getProjectId(),
      auth,
    })
    .firestore();
}

// mock app's firestore initalizer
jest.mock('./models/repositories/app-repository');
// firebase/testing mocks serverTimestamp. We need to replace it.
serverTimestamp.mockReturnValue(firebase.firestore.FieldValue.serverTimestamp());

const rules = fs.readFileSync('firestore.rules', 'utf8');

beforeAll(() => {
  testNumber++;
  return firebase.loadFirestoreRules({
    projectId: getProjectId(),
    rules,
  });
});

afterAll(() => Promise.all(firebase.apps().map(app => app.delete())));

describe('/users', () => {
  it('save unauthorized user', async () => {
    const db = authedApp(undefined);
    firebaseDB.mockReturnValue(db);
    const user = userRef('ninjinkun');
    await firebase.assertFails(user.set({ birthday: 'January 1' }));
  });

  it('save to invalid collection', async () => {
    const db = authedApp({ uid: 'ninjinkun' });
    await firebase.assertFails(db.doc('test/ninjinkun').set({ hoge: 'fuga' }));
  });
});

describe('/users/:user_id/blogs', () => {
  it('save exepct blogs field', async () => {
    const db = authedApp({ uid: 'ninjinkun' });
    firebaseDB.mockReturnValue(db);
    const user = userRef('ninjinkun');

    await firebase.assertFails(user.set({ hoge: 'fuga' }));
  });

  it('save blog', async () => {
    const db = authedApp({ uid: 'ninjinkun' });
    firebaseDB.mockReturnValue(db);

    await firebase.assertSucceeds(
      saveBlog(
        'ninjinkun',
        'https://ninjinkun.hatenablog.com/',
        "ninjinkun's diary",
        'https://ninjinkun.hatenablog.com/feed',
        'atom'
      )
    );
  });

  it('save other users blog', async () => {
    const db = authedApp({ uid: 'daikonkun' });
    firebaseDB.mockReturnValue(db);

    await firebase.assertFails(
      saveBlog(
        'ninjinkun',
        'https://ninjinkun.hatenablog.com/',
        "ninjinkun's diary",
        'https://ninjinkun.hatenablog.com/feed',
        'atom'
      )
    );
  });
});

describe('/users/:user_id/blogs/:blog_id/items', () => {
  it('save items', async () => {
    const db = authedApp({ uid: 'ninjinkun' });
    firebaseDB.mockReturnValue(db);
    writeBatch.mockReturnValue(db.batch());

    const batch = writeBatch();
    saveItemBatch(
      batch,
      'ninjinkun',
      'https://ninjinkun.hatenablog.com/',
      'https://ninjinkun.hatenablog.com/entry/12345',
      'Developing blog-feedback-app',
      new Date(),
      {},
      {}
    );

    await firebase.assertSucceeds(batch.commit());
  });
});
