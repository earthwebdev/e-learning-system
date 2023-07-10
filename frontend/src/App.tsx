
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/dashboard';
import './App.css'
import Sidebar from './components/Sidebar';
import LecturesPage from './pages/lectures';
import AddLecturesPage from './pages/lectures/add'
import EditLecturesPage from './pages/lectures/edit'
import LogoutPage from './pages/logout';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
        <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/' element={<Sidebar />}>
                <Route path='/dashboard' element={<DashboardPage />} />
                <Route path='/lectures' element={<LecturesPage />} />
                <Route path='/lectures/add' element={<AddLecturesPage />} />
                <Route path='/lectures/:id' element={<EditLecturesPage />} />
                <Route path='/logout' element={<LogoutPage />} />
                
            </Route>
        </Routes>
        <ToastContainer />
    </>
  )
}

export default App
