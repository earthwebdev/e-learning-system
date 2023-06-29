import React, {useState} from "react";
import { TextField, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

import { getPostDatasFromAxios } from "../services/axios.service";
 
const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
 
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
            console.log(email, password);

            const data = {email, password};
            const resp: any = await getPostDatasFromAxios('/users/login', data);
            console.log(resp);

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
                    
                </form>
                <small>Need an account? <Link to="/register">Register here</Link></small>
            </React.Fragment>
        </Container>
     );
}
 
export default LoginPage;