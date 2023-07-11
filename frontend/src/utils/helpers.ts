import { useSelector } from 'react-redux';

export const getJWTToken = () => {
    const { jwt } = useSelector((state: any) => state.auth);
    return jwt;
}
export const getLoggedIn = () => {
    const { isLoggedIn } = useSelector((state: any) => state.auth);
    return isLoggedIn;
}
export const getRole = () => {
    const { role } = useSelector((state: any) => state.auth);
    return role;
}


export const getRoleAccess = (data: string) => {
    const { role } = useSelector((state: any) => state.auth);
    if(data === role)
        return true;
    return false
}
    