## Getting Started

### Instalation Processs

1. Clone the repo:

```sh
  git clone git@github.com:eaemilio/webrtc-starter.git
```

2. Install dependencies:

```sh
  npm install
```

3. Start the server:

```sh
  npm start
```

### Firebase Setup

1. Go to your Firebase console and create a new Firebase Project

3. Enable Firestore

5. Create the following collections on your Firestore:
  * offerCandidates
  * answerCandidates
  * rooms

### Register app in Firebase

1. After you have a Firebase project, you can register your web app with that project.

2. In the center of the Firebase console's project overview page, click the Web icon to launch the setup workflow.

3. If you've already added an app to your Firebase project, click Add app to display the platform options.

4. Enter your app's nickname.

5. Click Register app.

6. Copy the `firebaseConfig` object, it should look like this:

```JSON
  {
    "apiKey": "XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "authDomain": "webrtc-xxxxx.firebaseapp.com",
    "projectId": "webrtc-xxxxx",
    "storageBucket": "webrtc-xxxxx.appspot.com",
    "messagingSenderId": "xxxxxxxxxx",
    "appId": "1:xxxxxxxxxxxxxxx:web:xxxxxxxxxxxxxxx"
  }
```

7. Encode the JSON object using an online tool like https://codebeautify.org/json-to-base64-converter, your enconed JSON should look like this: 

```sh
ewogICJhcGlLZXkiOiAiSkl6YVN5RFZoUzBMSTNPQXRyYVVUb3EzbFZFRHdaOEtrckdNc0MwIiwKICAiYXV0aERvbWFpbiI6ICJ3ZWJydGMtMTIzNC5maXJlYmFzZWFwcC5jb20iLAogICJwcm9qZWN0SWQiOiAid2VicnRjLTEyMzQiLAogICJzdG9yYWdlQnVja2V0IjogIndlYnJ0Yy0xMjM0LmFwcHNwb3QuY29tIiwKICAibWVzc2FnaW5nU2VuZGVySWQiOiAiNTY0NjU0NjU0IiwKICAiYXBwSWQiOiAiMTo5NDk4OTU2NDgwOTY6d2ViOjM3NDIxMzRiMmIwZTQyOTliYWM0MDUiCn0=
```
8. Finally, create an .env.local file and put the encoded JSON into a `REACT_APP_FIREBASE_CONFIG` variable.

9. You're ready to go!



