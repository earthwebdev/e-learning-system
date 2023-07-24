import { Navigate, Outlet } from 'react-router-dom';
import { getLoggedIn } from '../utils/helpers';
import { getCookie } from '../helpers/cookies.helper';
const SecureRoutesPage = () => {
    const isLoggedIn = getLoggedIn();
    const jwt = getCookie("jwtToken") || '';
    const role = getCookie("role") || '';
    //console.log(isLoggedIn);
    return <>
        { isLoggedIn || (jwt && role) ? <Outlet /> : <Navigate to={'/'} />}
    </>    
}

export default SecureRoutesPage