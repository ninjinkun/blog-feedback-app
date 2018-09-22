import * as firebase from 'firebase/app';

export const initializeFirebase = () => {
  const config = {
    apiKey: 'AIzaSyBxWFRf0NnBcC8Uf9JJggjkOlaGGAdZwvE',
    authDomain: 'feedback-5e26f.firebaseapp.com',
    databaseURL: 'https://feedback-5e26f.firebaseio.com',
    projectId: 'feedback-5e26f',
    storageBucket: 'feedback-5e26f.appspot.com',
    messagingSenderId: '844615095944'
  };
  firebase.initializeApp(config);

  const db: firebase.firestore.Firestore = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  db.settings(settings);
  db.enablePersistence();
};
