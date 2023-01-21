import React, { useState } from 'react';
import './Login.css';
import { Grid, TextField } from '@material-ui/core';
import { signIn, fetchCurrentUser } from '../../service';
import { useHistory } from "react-router-dom"
import plants from '../../Assets/images/login-register-image.png'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  const handleLogin = async () => {
    await signIn(email, password);

    setTimeout(handleAuthentication, 2000);
  }

  const handleAuthentication = async () => {
    const currentUser = await fetchCurrentUser();
    if (currentUser) {
      history.push('/home');
    } else {
      window.alert('Email/kata sandi salah. Silakan coba lagi');
    }
  }

  return (
    <Grid container>
      <Grid item xs={7}>
        <div style={{width: '100%'}}>
          <img src={plants} alt='' className='plants-img'/>
        </div>
      </Grid>
      <Grid item xs={5}>
        <div className='form-container'>
          <div style={{height: '48px'}}></div>
          <h1 style={{textAlign: 'left', fontSize: '48px'}}> Masuk </h1>
          <Grid container alignItems="flex-end">
            <Grid item xs={12}>
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                fullWidth="true"
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
              />

            </Grid>
          </Grid>
          <div style={{height: '40px'}}></div>
          <Grid container alignItems="flex-end">
            <Grid item xs={12}>
              <TextField
                id="password"
                label="Kata Sandi"
                type="password"
                variant="outlined"
                fullWidth="true"
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
              />
            </Grid>
          </Grid>
          <div style={{ margin: '60px 0'}}>
            <p>Belum punya akun? <a href="/register">Buat akun sekarang</a></p>
          </div>
          <Grid container>
            <Grid item xs={4}></Grid>
            <Grid item xs={4} alignItems='center'>
              <div className="login-btn" onClick={() => handleLogin()}>
                Masuk
              </div>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  )
};

export default Login;