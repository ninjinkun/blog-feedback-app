import * as firebase from '@firebase/testing';
import { auth } from 'firebase';
import fs from 'fs';
import { db as firebaseDB, serverTimestamp } from './models/repositories/app-repository';
import { blogRef, saveBlog } from './models/repositories/blog-repository';
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

beforeEach(async () => {
  testNumber++;
  await firebase.loadFirestoreRules({
    projectId: getProjectId(),
    rules,
  });
});

afterEach(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
});

it('require users to log in before creating a blog', async () => {
  const db = authedApp(undefined);
  firebaseDB.mockReturnValue(db);
  const user = userRef('ninjinkun');
  await firebase.assertFails(user.set({ birthday: 'January 1' }));
});

it('save exepct blogs field', async () => {
  const db = authedApp({ uid: 'ninjinkun' });
  firebaseDB.mockReturnValue(db);
  const user = userRef('ninjinkun');

  await firebase.assertFails(
    user.set({ birthday: 'January 1', timestamp: firebase.firestore.FieldValue.serverTimestamp() })
  );
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
