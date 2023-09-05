import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { Link, useHistory} from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory()
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(false);
  const { closeModal } = useModal();

  useEffect(()=>{
    if(credential.length < 4 || password < 6 ){
    setDisable(true)
    }else{
      setDisable(false)
    }
  },[credential, password, disable])
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .then(history.push('/'))
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        console.log(data.errors)
        setErrors(data.errors);
      }else{closeModal()}
      });
  };

  const demoUser = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({credential: 'Demo-lition', password: 'password'})
    ).then(() =>{
      closeModal();
    }).then(history.push('/'))
  }

  return (
    <div className="log-in">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p className="errors">{errors.credential}</p>
        )}
        <button type="submit" disabled={disable}>Log In</button>
        <Link onClick={demoUser}>
          Demo User
        </Link>
      </form>
    </div>
  );
}

export default LoginFormModal;