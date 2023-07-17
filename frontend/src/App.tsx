
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
import PrivateRoutes from './routes/PrivateRoutes';
import CourseAddPage from './pages/courses/add';
import EditCoursesPage from './pages/courses/edit';
import CartPage from './pages/cart';
import SectionPage from './pages/sections';
import SectionAddPage from './pages/sections/add';
import EditSectionsPage from './pages/sections/edit';
import SuccessPage from './pages/SuccessPage';

function App() {

  return (
    <>
        <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/' element={<SecureRoutes />}>
                <Route path='/' element={<Sidebar />}>
                  <Route path='/dashboard' element={<DashboardPage />} />
                  <Route path='/' element={<PrivateRoutes />} >
                    <Route path='/lectures' element={<LecturesPage />} />
                    <Route path='/lectures/add' element={<AddLecturesPage />} />
                    <Route path='/lectures/:id' element={<EditLecturesPage />} />
                    <Route path='/courses/add' element={<CourseAddPage />} />
                    <Route path='/courses/:id' element={<EditCoursesPage />} />

                    <Route path='/sections' element={<SectionPage />} />
                    <Route path='/sections/add' element={<SectionAddPage />} />
                    <Route path='/sections/:id' element={<EditSectionsPage />} />
                  </Route>
                  <Route path='/success' element={<SuccessPage />} />
                  <Route path='/cart' element={<CartPage />} />
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
