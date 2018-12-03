import * as firebase from '@firebase/testing';
import { auth } from 'firebase';
import fs from 'fs';
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

it('require users to log in before creating a profile', async () => {
  const db = authedApp(undefined);
  const profile = db.collection('users').doc('ninjinkun');
  await firebase.assertFails(profile.set({ birthday: 'January 1' }));
});

// @test
it('should enforce the createdAt date in user profiles', async () => {
  const db = authedApp({ uid: 'alice' });
  const profile = db.collection('users').doc('ninjinkun');
  await firebase.assertFails(profile.set({ birthday: 'January 1' }));
  await firebase.assertSucceeds(
    profile.set({
      birthday: 'January 1',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
  );
});
