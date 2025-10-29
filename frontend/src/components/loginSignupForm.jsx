import supabase from '../services/supabase-client';
import { useState } from 'react';

function LoginSignupForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (isSignUp) {
  //     const {error: signUpError} = await supabase.auth.signUp({email, password});
  //     if (signUpError) {
  //       console.error("Error signing up:", signUpError.message);
  //       return
  //     }
  //   } else {
  //     const {error: signInError} = await supabase.auth.signInWithPassword({email, password})
  //     if (signInError) {
  //       console.error("Error signing up:", signInError.message);
  //       return
  //     }
  //   }
  // }

  async function handleSubmit() {
    console.log(email, password)

    if (isSignUp) {
      const {error: signUpError} = await supabase.auth.signUp({email, password});
      if (signUpError) {
        console.error("Error signing up:", signUpError.message);
        return
      }
    } else {
      const {error: signInError} = await supabase.auth.signInWithPassword({email, password})
      if (signInError) {
        console.error("Error signing up:", signInError.message);
        return
      }
    }
  }

  return <div>
          <label>
            Email: 
            <input
              type="text"
              value={email} //Whatever the state is, that is what the value of the input field will be
              onChange={(e) => setEmail(e.target.value)} //When you type, this function runs and updates the state
            />
          </label>
          <hr />
          <label>
            Password: 
            <input
              type="text"
              value={password} //Whatever the state is, that is what the value of the input field will be
              onChange={(e) => setPassword(e.target.value)} //When you type, this function runs and updates the state
            />
          </label>
          <hr />
          <label>
            Remember me
            <input type="checkbox" name="myCheckbox" defaultChecked={true} />
          </label>
          <hr />
          <button
            onClick={
              // () => {}
              handleSubmit
            }
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
            }}
          >
            {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
          </button>
        </div>
}


// // Check for existing session
// const {
//   data: { session },
// } = await supabase.auth.getSession();
// // Listen for auth changes
// supabase.auth.onAuthStateChange((event, session) => {
//   if (event === "SIGNED_IN") {
//     // Update UI for authenticated state
//   } else if (event === "SIGNED_OUT") {
//     // Update UI for unauthenticated state
//   }
// });

export default LoginSignupForm;