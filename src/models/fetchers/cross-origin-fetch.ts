import firebase from 'firebase/app';
import 'firebase/functions';

export const crossOriginFetch = (url: string) =>
  firebase.app().functions('asia-northeast1').httpsCallable('crossOriginFetch')({ url });
