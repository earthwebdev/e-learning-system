
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/dashboard';
import './App.css'
import Sidebar from './components/Sidebar';

function App() {

  return (
    <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/' element={<Sidebar />}>
            <Route path='/dashboard' element={<DashboardPage />} />
        </Route>
    </Routes>
        
    
  )
}

export default App
