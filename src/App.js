import './App.css'
import firebase from 'firebase/app'
import 'firebase/auth'
import FirebaseConfig from './Components/FirebaseConfig/FirebaseConfig'
import { useState } from 'react'

if (!firebase.apps.length) {
  firebase.initializeApp(FirebaseConfig)
}
function App () {
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    success: null,
    errorMessage: ''
  })

  const googleProvider = new firebase.auth.GoogleAuthProvider()
  var fbProvider = new firebase.auth.FacebookAuthProvider()
  var githubProvider = new firebase.auth.GithubAuthProvider()

  // sign in user handle all ;
  const allSignInHandle = providerName => {
    firebase
      .auth()
      .signInWithPopup(providerName)
      .then(res => {
        console.log(res.user)
        const { displayName, email, photoURL } = res.user
        const displayUsr = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(displayUsr)
      })
      .catch(error => console.log(error))
  }

  // log out user handle
  const signOutHandle = () => {
    firebase
      .auth()
      .signOut()
      .then(res => {
        const userLogout = {
          isSignIn: false
        }
        setUser(userLogout)
      })
      .catch(error => {
        console.log(error)
      })
  }

  // form control all function start here(create user + sign in with email and password)

  const handleSubmit = e => {
    firebase
    .auth()
    .createUserWithEmailAndPassword(user.email, user.password)
    .then(res => {
      const newUserInfo = { ...user }
      newUserInfo.errorMessage = ''
      newUserInfo.success = true
      setUser(newUserInfo)
      console.log(user)
      console.log(res.user)
    })
    .catch(error => {
      var errorCode = error.code
      var errorMessage = error.message
      console.log(errorCode, errorMessage)
      const newUserInfo = { ...user }
      newUserInfo.success = false
      newUserInfo.errorMessage = errorMessage
      setUser(newUserInfo)
    })
    
    e.preventDefault()
  }

  // handle input value changes
  const inputValueUpdated = e => {
    let validatedForm = true
    if (e.target.name === 'email') {
      validatedForm = /\S+@\S+\.\S+/.test(e.target.value)
    }
    if (e.target.name === 'password') {
      validatedForm = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{4,}$/.test(
        e.target.value
      )
    }
    if (validatedForm) {
      const newUserInfo = { ...user }
      newUserInfo[e.target.name] = e.target.value
      setUser(newUserInfo)
    }
    console.log(e.target.name, ' = ', e.target.value)
  }

  console.log(user)

  return (
    <div className='App'>
      {user.isSignIn ? (
        <button onClick={signOutHandle}>Log Out</button>
      ) : (
        <div>
          <button onClick={() => allSignInHandle(googleProvider)}>
            Sign In With Google
          </button>
          <br />
          <button onClick={() => allSignInHandle(fbProvider)}>
            Sign In With Facebook
          </button>
          <br />
          <button onClick={() => allSignInHandle(githubProvider)}>
            Sign In With Github
          </button>
        </div>
      )}
      {user.isSignIn && (
        <div>
          <h3>Name: {user.name === null ? 'Annonymous User' : user.name}</h3>
          <h3>Email: {user.email}</h3>
          <img
            style={{ borderRadius: '50%', width: '40px', height: '40px' }}
            src={user.photo}
            alt={user.photo}
          />
        </div>
      )}
      <br />

      <label>
        <input
          type='checkbox'
          value=''
        />
        Registera a new user
      </label>
      <br />
      <br />

      <form onSubmit={handleSubmit}>
            <input
              type='text'
              name='name'
              id='userName'
              required='required'
              placeholder='Your Name'
              onBlur={inputValueUpdated}
            />
            <br />
            <br />
        <input
          type='text'
          name='email'
          id='email'
          required
          placeholder='Your Email'
          onBlur={inputValueUpdated}
        />
        <br />
        <br />

        <input
          type='password'
          name='password'
          id='paassword'
          required='required'
          placeholder='Type Password'
          onBlur={inputValueUpdated}
        />
        <br />
        <br />
        <input type='submit' value= 'SignUp' />
      </form>

      {/* <h6>{!user.success && user.errorMessage}</h6> */}
      {!user.success &&(
        <h4 style={{ color: 'red' }}>{user.errorMessage}</h4>
      )}
      {user.success && (
        <h4 style={{ color: 'green' }}>User Account Created Successfully</h4>
      )}
    </div>
  )
}

export default App
