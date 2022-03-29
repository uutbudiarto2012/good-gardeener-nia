import React, { useState } from 'react';
import './Register.css';
import { FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@material-ui/core';
import { signUp, fetchCurrentUser } from '../../service';
import { useHistory } from 'react-router-dom';
import plants from '../../Assets/images/login-register-image.png'

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('client');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');

  const history = useHistory();

  const handleRegister = async () => {
    const clientData = {
      nama: name,
      alamat: '',
      picture: 'https://images.pexels.com/photos/162564/gardener-worker-gardening-machinery-162564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    }

    const consultantData = {
      nama: name,
      harga: 15000,
      picture: 'https://images.pexels.com/photos/162564/gardener-worker-gardening-machinery-162564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      pendidikan: education,
      pengalaman: experience
    }

    await signUp(email, password, role === 'client' ? clientData : consultantData, role);

    setTimeout(handleAuthentication, 2000);
  }

  const handleAuthentication = async () => {
    const currentUser = await fetchCurrentUser();
    if (currentUser) {
      history.push('/home');
    } else {
      window.alert('Wrong email/password. Please try again');
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
        <div className='register-form-container'>
          <div style={{height: '24px'}}></div>
          <h1 style={{textAlign: 'left', fontSize: '48px'}}>Register</h1>
          <Grid container alignItems="flex-end">
            <Grid item xs={12}>
              <TextField
                id="name"
                label="Nama"
                variant="outlined"
                fullWidth="true"
                value={name}
                onChange={(e) => {setName(e.target.value)}}
              />
            </Grid>
          </Grid>
          <div style={{height: '20px'}}></div>
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
          <div style={{height: '20px'}}></div>
          <Grid container alignItems="flex-end">
            <Grid item xs={12}>
              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth="true"
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
              />
            </Grid>
          </Grid>
          <div style={{height: '20px'}}></div>
          <Grid container alignItems="flex-end">
            <Grid item xs={12}>
              <TextField
                id="phone"
                label="No. Telepon"
                variant="outlined"
                fullWidth="true"
                value={phone}
                onChange={(e) => {setPhone(e.target.value)}}
              />
            </Grid>
          </Grid>
          <div style={{height: '20px'}}></div>
          <div>
            <p style={{textAlign: 'left'}}>Mendaftar sebagai</p>
            <RadioGroup
              row aria-label="role"
              name="row-radio-buttons-group"
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel value="client" control={<Radio />} label="Klien" />
              <FormControlLabel value="consultant" control={<Radio />} label="Konsultan" />
            </RadioGroup>
          </div>
          { role === 'consultant' ? <>
            <div style={{height: '20px'}}></div>
            <Grid container alignItems="flex-end">
              <Grid item xs={12}>
                <TextField
                  id="education"
                  label="Pendidikan"
                  variant="outlined"
                  fullWidth="true"
                  value={education}
                  onChange={(e) => {setEducation(e.target.value)}}
                />
              </Grid>
            </Grid>
            <div style={{height: '20px'}}></div>
            <Grid container alignItems="flex-end">
              <Grid item xs={12}>
                <TextField
                  id="experience"
                  label="Pengalaman"
                  variant="outlined"
                  fullWidth="true"
                  value={experience}
                  multiline
                  rows={4}
                  onChange={(e) => {setExperience(e.target.value)}}
                />
              </Grid>
            </Grid>
          </> : <></>}
          <div style={{ margin: '60px 0'}}>
            <p>Sudah punya akun? <a href="/login">Masuk sekarang</a></p>
          </div>
          <Grid container>
            <Grid item xs={4}></Grid>
            <Grid item xs={4} alignItems='center'>
              <div className="login-btn" onClick={() => handleRegister()}>
                Register
              </div>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  )
};

export default Register;