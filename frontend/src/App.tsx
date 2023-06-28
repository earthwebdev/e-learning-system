
import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/signIn';
import DashboardPage from './pages/dashboard';
import './App.css'

function App() {

  return (
    <Routes>
        <Route path='/' element={<SignInPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
    </Routes>
        
    
  )
}

export default App
