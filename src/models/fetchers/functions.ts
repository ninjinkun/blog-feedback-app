import firebase from 'firebase/app';
import 'firebase/functions';

type Response = {
  data: { body: string };
};

export function crossOriginFetch(url: string): Promise<Response> {
  const crossOriginFetch = firebase.app().functions('asia-northeast1').httpsCallable('crossOriginFetch');
  return crossOriginFetch({ url });
}
