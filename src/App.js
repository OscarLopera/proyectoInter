import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";


import './App.css';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyAVQz533Gr7ANyXryYWZ-wLgEz2WaANsUw",
  authDomain: "proyectointerdisciplinariof.firebaseapp.com",
  projectId: "proyectointerdisciplinariof",
  storageBucket: "proyectointerdisciplinariof.appspot.com",
  messagingSenderId: "117992329451",
  appId: "1:117992329451:web:07a3c0fc60579e30ae6eae"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <div className="inicio">
        <div className="text">
          <header>
            <h1 className="title-sofkachat">Proyecto interdisciplinario </h1>
            <SignOut />
          </header>

          <section>
            {user ? <City /> : <SignIn />}

          </section>



        </div>
      </div>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle} className="signin" data-testid="btn-signin">Sign in with google</button>;
}

function SignOut() {
  return (
    auth.currentUser && (
      <button
        onClick={() => {
          auth.signOut();
        }} className="boton-out"
      >
        Sign out
      </button>
    )
  );
}


const City = () => {
  const cityRef = firestore.collection("cities");
  const query = cityRef.orderBy("createdAt");
  const [cities] = useCollectionData(query, { idField: "id" });
  const dummy = useRef();

  const [formValue, setFormValue] = useState("");


  const addCity = async (e) => {
    e.preventDefault();
    const { uid, photoURL, displayName } = auth.currentUser;

    await cityRef.add({
      Text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL,
    });

    setFormValue("");
  };
  return <main><div>
    {cities &&
      cities.map((msn) => <CitiesList key={msn.id} city={msn} />)}
  </div>
    <div className="form-message">
      <form onSubmit={addCity}>
        <input
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
          placeholder="Ingresa tu ciudad" className="input-message"
        />
        <button type="submit" disabled={!formValue} className="boton-enviar">Enviar</button>
      </form>
    </div>
  </main>

  function CitiesList({ city }) {

    const { Text, uid, photoURL, displayName } = city;

    return (
      <div>
        <div className="user">

          <img src={photoURL} alt={"avatar"} style={{ width: "50px" }} className="fotoPerfil" />
          <small className="username">{displayName}</small> <br />
        </div>



        <div className="message">
          <p >{Text}</p>
        </div>
      </div>

    );

  }

}







export default App;
