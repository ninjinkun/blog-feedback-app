[![CircleCI](https://circleci.com/gh/ninjinkun/blog-feedback-app.svg?style=svg&circle-token=f9faff2d125195261cccf6cf8f6c9aabd1733603)](https://circleci.com/gh/ninjinkun/blog-feedback-app)

BlogFeedback is a PWA visualize your blog's impact. 

<img src="https://user-images.githubusercontent.com/113420/50003891-97424b80-ffe8-11e8-949f-def709c14aa5.gif">

This app is based on below modules and services.
- React
- create-react-app
- styled-component
- Redux
- redux-thunk
- redux-saga
- Firebase
  - Authentication
  - Cloud Firestore
  - Cloud Functions

# Commands
## Run
```
$ yarn start
```

## Storybook
You can access Storybook [here](https://ninjinkun.github.io/blog-feedback-app/).

or

```
$ yarn storybook
```

## Staging Build
```
$ yarn build
```

## Production Build
```
$ yarn build:production
```

# Test

```
$ yarn firebase serve --only firestore
$ yarn test
```
