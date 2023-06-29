//local signup functions
import React, {useState} from 'react';
import { TextField, Button, Container, Stack } from '@mui/material';
import { Link } from "react-router-dom"
import { getPostDatasFromAxios } from '../services/axios.service';
import { useNavigate } from 'react-router-dom';
//google auth to use for the signup 
import { GoogleLogin } from '@react-oauth/google';


const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  //google auth success redirect funciton
  const SERVER_URL: any = import.meta.env.VITE_SERVER_URL;
   //google auth success redirect funciton
  const successResponse = ((credentialResponse: object) => {
    console.log(credentialResponse);
    window.location.href = SERVER_URL + '/auth/google';
  });

  
     const  handleSubmit = async (event: any) => {
      event.preventDefault();
      console.log(fullName, email, password);
      const data = {fullName, email, password};
      const resp: any = await getPostDatasFromAxios('/users/register', data);
      console.log(resp);
      if(resp.status)
      {
        navigate('/');
      }
    }

  return (
    <Container>
        <React.Fragment>
            <h2>Register Form</h2>
            <form onSubmit={handleSubmit} action="/register" >
                <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                    <TextField
                        type="text"
                        variant='outlined'
                        color='secondary'
                        label="Full Name"
                        onChange={e => setFullName(e.target.value)}
                        value={fullName}
                        fullWidth
                        required
                    />                    
                </Stack>
                <TextField
                    type="email"
                    variant='outlined'
                    color='secondary'
                    label="Email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    fullWidth
                    required
                    sx={{mb: 4}}
                />
                <TextField
                    type="password"
                    variant='outlined'
                    color='secondary'
                    label="Password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    required 
                    fullWidth
                    sx={{mb: 4}}
                />                
                <Button variant="outlined" color="secondary" type="submit">Register</Button>
                <GoogleLogin
                  onSuccess={successResponse }
                  onError={() => {
                    console.log('Login Failed');
                    navigate('/login/failed');
                  }}
                />
            </form>
            <small>Already have an account? <Link to="/">Login Here</Link></small>
     
        </React.Fragment>        
    </Container>
  )
}

export default RegisterPage