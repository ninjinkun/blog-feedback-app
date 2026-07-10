[![CircleCI](https://circleci.com/gh/ninjinkun/blog-feedback-app.svg?style=svg&circle-token=f9faff2d125195261cccf6cf8f6c9aabd1733603)](https://circleci.com/gh/ninjinkun/blog-feedback-app)

BlogFeedback is a PWA visualize your blog's impact.

<img src="https://user-images.githubusercontent.com/113420/50003891-97424b80-ffe8-11e8-949f-def709c14aa5.gif">

This app is based on below modules and services.

- React
- Vite
- styled-components
- Redux (Redux Toolkit)
  - redux-thunk
  - redux-saga
- Firebase
  - Authentication
  - Cloud Firestore
  - Cloud Functions

# Requirements

- Node.js 20+
- JDK 21+ (for the Firestore emulator)

# Commands

## Run

```
$ npm install
$ npm run dev
```

## Storybook

You can access Storybook [here](https://ninjinkun.github.io/blog-feedback-app/).

or

```
$ npm run storybook
```

## Staging Build

```
$ npm run build
```

## Production Build

```
$ npm run build:production
```

# Test

Unit tests:

```
$ npm test
```

Firestore security rules tests require the Firestore emulator:

```
$ npx firebase emulators:start --only firestore --project firestore-emulator-example
$ npm test
```

# Lint / Typecheck

```
$ npm run eslint
$ npm run typecheck
```
