import firebase from 'firebase/app';
import 'firebase/firestore';

export function initializeFirebase() {
  validateDotEnv();

  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  };
  firebase.initializeApp(config);

  const db: firebase.firestore.Firestore = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  db.settings(settings);
  db.enablePersistence();
}

const DotEnvKeys = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_DATABASE_URL',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID'
];

function validateDotEnv() {
  if (!process.env) {
    throw `.env file is missing.`;
  }
  for (let key of DotEnvKeys) {
    if (!process.env[key]) {
      throw `${key} is missing in .env file.`;
    }
  }
}