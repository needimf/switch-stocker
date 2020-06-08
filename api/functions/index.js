// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');

// Local imports


admin.initializeApp();

exports.uptickHeartbeat = functions.https.onRequest((async (req, res) => {
  // update heartbeat
  try {
    await admin.database().ref('/server/heartbeat').set(Date.now());
    res.json({ result: 'Successfully wrote heartbeat' });
  } catch (err) {
    res.json({ result: 'Write failed' });
  }
}));

// exports.fetchBestBuySwitchStock = functions.database.ref('/server/heartbeat')
//   .onCreate((snapshot, context) => {

//   });
