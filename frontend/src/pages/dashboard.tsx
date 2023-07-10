import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCookie } from '../helpers/cookies.helper';
import { useDispatch } from 'react-redux';
import { login } from "./SignIn/authSlice";
const dashboardPage = () => {
  const dispatch = useDispatch();
  
  const jwt = getCookie("jwtToken") || '';
  const role = getCookie("role") || '';
  //console.log(jwt, role);
  const data = {
    jwt, role
  }
  const navigate = useNavigate();
  const loginstate = useSelector((state: any) => state.auth.isLoggedIn);
    //console.log(loginstate, '====');
     useEffect( () => {
      if(jwt && role){
        dispatch(login(data));
      } else if(!loginstate){
            navigate('/');
      }
    }, []); 


  return (
    <>
      <div className="text-bold text-3xl">Dashboard</div>
    </>
  )
}

export default dashboardPage