import React from 'react'
import { getRoleAccess } from '../utils/helpers'
import { Outlet } from 'react-router-dom';
import AccessDeniedPage from '../pages/AccessDenied';

const PrivateRoutes = () => {
    const accessRole = getRoleAccess('admin');
  return (
    <>
    {  accessRole ? <Outlet /> : <AccessDeniedPage /> }
    </>
  )
}

export default PrivateRoutes