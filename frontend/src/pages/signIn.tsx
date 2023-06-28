import { GoogleLogin } from '@react-oauth/google';

const signInPage = () => {

  const SERVER_URL: any = import.meta.env.VITE_SERVER_URL;
  const successResponse = ((credentialResponse: object) => {
    console.log(credentialResponse);
    window.location.href = SERVER_URL + '/auth/google';
  });

  return (
    <>
        <GoogleLogin
          onSuccess={successResponse }
          onError={() => {
            console.log('Login Failed');
          }}
        />
    </>
  )
}

export default signInPage