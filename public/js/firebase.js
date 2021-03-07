const firebase=require('firebase');
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyCVobQNf39UNtPk5oCz_RLxN6rkjEYdAKA",
    authDomain: "blanche-16534.firebaseapp.com",
    projectId: "blanche-16534",
    storageBucket: "blanche-16534.appspot.com",
    messagingSenderId: "1024921998816",
    appId: "1:1024921998816:web:a9f87a7d41305884ec4785",
    measurementId: "G-ESE1SBY0CE"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  module.exports= firebase;