import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from './SignIn/authSlice'
import { useNavigate } from 'react-router-dom';
import { getDatasFromAxios } from '../services/axios.service';
import {getJWTToken} from '../utils/helpers';

const LogoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //const jwtToken = useSelector((state:any) => state?.auth?.token);
    const jwtToken = getJWTToken();
    //const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBldGVyQGVtYWlsLmNvbSIsImlhdCI6MTY4ODg3NzQzOSwiZXhwIjoxNjg5MTM2NjM5fQ.GiVk2UHsI5ZODG93NmY0WJjEE9JlZlDoD3l2gqAePzo';
    const getLogout = async() => {
        const response: any = await getDatasFromAxios('/users/logout', jwtToken);
        console.log(response);
        dispatch(logout());
    }
    navigate('/');
    useEffect(() => {
        getLogout();
    }, [])
  return (
    <>
    logout
    </>
  )
}

export default LogoutPage