import { Navigate, Outlet } from 'react-router-dom';
import { getLoggedIn } from '../utils/helpers';

const SecureRoutesPage = () => {
    const isLoggedIn = getLoggedIn();
    return <>
        { isLoggedIn ? <Outlet /> : <Navigate to={'/'} />}
    </>    
}

export default SecureRoutesPage