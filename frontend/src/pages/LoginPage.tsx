import React, {useEffect, useState} from "react";
import { TextField, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

import { getPostDatasFromAxios } from "../services/axios.service";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./SignIn/authSlice";

import messaging from "../config/firebase.config";
import { getToken } from "firebase/messaging";
import { errorToast, successToast } from "../services/toastify.service";
import { GoogleLogin } from '@react-oauth/google';
const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginstate = useSelector((state: any) => state.auth.isLoggedIn);
    //console.log(loginstate, '====');
    const SERVER_URL: any = import.meta.env.VITE_SERVER_URL;
   //google auth success redirect funciton
    const successResponse = ((credentialResponse: object) => {
        console.log(credentialResponse);
        window.location.href = SERVER_URL + '/auth/google';
    });

    useEffect( () => {
        if(loginstate){
            navigate('/dashboard');
        }
    }, []);

    const handleSubmit = async (event: any) => {
        event.preventDefault()
 
        setEmailError(false)
        setPasswordError(false)
 
        if (email == '') {
            setEmailError(true)
        }
        if (password == '') {
            setPasswordError(true)
        }
 
        if (email && password) {
            //console.log(email, password);
            const token = await getToken(messaging, {vapidKey: import.meta.env.VITE_FIREBASE_VALID_KEY });
            //console.log(token);return;
            const data = {email, password, fcm: token};
            const resp = await getPostDatasFromAxios('/users/login', data);
            //console.log(resp.data);
            if (resp.success) {
                dispatch(login(resp.data));                
                successToast(resp.message);
                navigate("/dashboard");
              } else {
                errorToast(resp?.message);
              }
            if(resp.status){
                dispatch(login(resp.data));
            }else{

            }

        }
    }
     
    return ( 
        <Container>
            <React.Fragment>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <h2>Login Form</h2>
                        <TextField 
                            label="Email"
                            onChange={e => setEmail(e.target.value)}
                            required
                            variant="outlined"
                            color="secondary"
                            type="email"
                            sx={{mb: 3}}
                            fullWidth
                            value={email}
                            error={emailError}
                        />
                        <TextField 
                            label="Password"
                            onChange={e => setPassword(e.target.value)}
                            required
                            variant="outlined"
                            color="secondary"
                            type="password"
                            value={password}
                            error={passwordError}
                            fullWidth
                            sx={{mb: 3}}
                        />
                        <Button variant="outlined" color="secondary" type="submit">Login</Button>
                        <GoogleLogin
                            onSuccess={successResponse }
                            onError={() => {
                                console.log('Login Failed');
                                navigate('/login/failed');
                            }}
                            />
                </form>
                <small>Need an account? <Link to="/register">Register here</Link></small>
            </React.Fragment>
        </Container>
     );
}
 
export default LoginPage;