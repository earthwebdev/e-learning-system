
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/dashboard';
import './App.css'
import SecureRoutes from './routes/SecureRoutes';
import Sidebar from './components/Sidebar';
import LecturesPage from './pages/lectures';
import AddLecturesPage from './pages/lectures/add'
import EditLecturesPage from './pages/lectures/edit'
import LogoutPage from './pages/logout';
import CoursesPage from './pages/courses';

function App() {

  return (
    <>
        <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/' element={<SecureRoutes />}>
              <Route path='/' element={<Sidebar />}>
                <Route path='/dashboard' element={<DashboardPage />} />
                <Route path='/lectures' element={<LecturesPage />} />
                <Route path='/lectures/add' element={<AddLecturesPage />} />
                <Route path='/lectures/:id' element={<EditLecturesPage />} />
                <Route path='/courses' element={<CoursesPage />} />
                <Route path='/logout' element={<LogoutPage />} />
              </Route>
            </Route>
        </Routes>
        <ToastContainer />
    </>
  )
}

export default App
