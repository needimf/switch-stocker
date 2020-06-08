// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');

// Local imports
const API = require('./apis');

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

exports.fetchAndSetSwitchStock = functions.database.ref('/server/heartbeat')
  .onWrite(async (snapshot, context) => {
    // Fetch current stock for each store
    const [storeStockStatuses, currentStockState] = await Promise.all([API.getSwitchStockStatuses(), admin.database().ref('/state/switchStock').once('value').then(snapshot => snapshot.val())]);

    await admin.database().ref('/state/switchStock').update(storeStockStatuses.reduce((acc, storeStatus) => {
      const storeName = storeStatus.store;
      const currentRedBlueStock = currentStockState && currentStockState[storeName] && currentStockState[storeName].inStockRedBlue;
      const currentGreyStock = currentStockState && currentStockState[storeName] && currentStockState[storeName].inStockGrey;
      if (currentRedBlueStock !== storeStatus.inStockRedBlue) {
        acc[`${storeName}/inStockRedBlue`] = Boolean(storeStatus.inStockRedBlue); 
      }
      if (currentGreyStock !== storeStatus.inStockGrey) {
        acc[`${storeName}/inStockGrey`] = Boolean(storeStatus.inStockGrey); 
      }
      return acc;
    }, {}));
  });
