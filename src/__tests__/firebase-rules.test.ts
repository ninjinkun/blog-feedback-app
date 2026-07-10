// @vitest-environment node
import {
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { Firestore, Timestamp, doc, serverTimestamp as firestoreServerTimestamp, setDoc } from 'firebase/firestore';
import fs from 'fs';
import { afterAll, beforeAll, describe, it, vi } from 'vitest';
import { db as firebaseDB, serverTimestamp } from '../models/repositories/app-repository';

import { saveBlog } from '../models/repositories/blog-repository';
import { itemRef, saveItem } from '../models/repositories/item-repository';
import { userRef } from '../models/repositories/user-repository';

// mock app's firestore initializer
vi.mock('../models/repositories/app-repository');

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'firestore-emulator-example',
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(() => testEnv.cleanup());

function authedDb(auth?: { uid: string }): Firestore {
  const context = auth ? testEnv.authenticatedContext(auth.uid) : testEnv.unauthenticatedContext();
  return context.firestore() as unknown as Firestore;
}

describe('/users', () => {
  it('save unauthorized user', async () => {
    const db = authedDb(undefined);
    vi.mocked(firebaseDB).mockReturnValue(db);
    const user = userRef('ninjinkun');
    await assertFails(setDoc(user, { birthday: 'January 1' }));
  });

  it('save to invalid collection', async () => {
    const db = authedDb({ uid: 'ninjinkun' });
    await assertFails(setDoc(doc(db, 'test/ninjinkun'), { hoge: 'fuga' }));
  });
});

describe('/users/:user_id/blogs', () => {
  it('save exepct blogs field', async () => {
    const db = authedDb({ uid: 'ninjinkun' });
    vi.mocked(firebaseDB).mockReturnValue(db);
    const user = userRef('ninjinkun');

    await assertFails(setDoc(user, { hoge: 'fuga' }));
  });

  it('save blog', async () => {
    const db = authedDb({ uid: 'ninjinkun' });
    vi.mocked(firebaseDB).mockReturnValue(db);
    vi.mocked(serverTimestamp).mockReturnValue(firestoreServerTimestamp());

    await assertSucceeds(
      saveBlog(
        'ninjinkun',
        'https://ninjinkun.hatenablog.com/',
        "ninjinkun's diary",
        'https://ninjinkun.hatenablog.com/feed',
        'atom',
        false,
        true,
        false,
        true,
        true,
        false,
        false
      )
    );
  });

  it('save other users blog', async () => {
    const db = authedDb({ uid: 'daikonkun' });
    vi.mocked(firebaseDB).mockReturnValue(db);
    vi.mocked(serverTimestamp).mockReturnValue(firestoreServerTimestamp());

    await assertFails(
      saveBlog(
        'ninjinkun',
        'https://ninjinkun.hatenablog.com/',
        "ninjinkun's diary",
        'https://ninjinkun.hatenablog.com/feed',
        'atom',
        false,
        true,
        false,
        true,
        true,
        false,
        false
      )
    );
  });
});

describe('/users/:user_id/blogs/:blog_id/items', () => {
  it('save items', async () => {
    const db = authedDb({ uid: 'ninjinkun' });
    vi.mocked(firebaseDB).mockReturnValue(db);
    vi.mocked(serverTimestamp).mockReturnValue(firestoreServerTimestamp());

    await assertSucceeds(
      saveItem(
        'ninjinkun',
        'https://ninjinkun.hatenablog.com/',
        'https://ninjinkun.hatenablog.com/entry/123456',
        'Developing blog-feedback-app',
        new Date(),
        { facebook: { count: 10, timestamp: Timestamp.now() } },
        {}
      )
    );
  });

  it('save invalid items', async () => {
    const db = authedDb({ uid: 'ninjinkun' });
    vi.mocked(firebaseDB).mockReturnValue(db);

    const item = itemRef(
      'ninjinkun',
      'https://ninjinkun.hatenablog.com/',
      'https://ninjinkun.hatenablog.com/entry/123457'
    );
    await assertFails(
      setDoc(item, {
        title: 'Developing blog-feedback-app',
        url: 'https://ninjinkun.hatenablog.com/entry/123457',
        published: 'hoge',
      })
    );
  });

  it('save invalid count items', async () => {
    const db = authedDb({ uid: 'ninjinkun' });
    vi.mocked(firebaseDB).mockReturnValue(db);
    vi.mocked(serverTimestamp).mockReturnValue(firestoreServerTimestamp());

    const item = itemRef(
      'ninjinkun',
      'https://ninjinkun.hatenablog.com/',
      'https://ninjinkun.hatenablog.com/entry/123458'
    );

    await assertFails(
      setDoc(item, {
        title: 'Developing blog-feedback-app',
        url: 'https://ninjinkun.hatenablog.com/entry/123458',
        published: new Date(),
        count: { facebook: { count: 'fuga', timestamp: serverTimestamp() } },
      })
    );
  });
});
