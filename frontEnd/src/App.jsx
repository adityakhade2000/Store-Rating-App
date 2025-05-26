
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AdminDashboard from './components/Admin/AdminDashboard';
import PrivateRoute from './PrivateRoute';
import AdminHome from './components/Admin/AdminHome';
import ManageUsers from './components/Admin/ManageUsers';
import ManageStores from './components/Admin/ManageStores';
import SignUpForm from './components/Login/SignUpForm';
import Login from './components/Login/Login';
import UserDashboard from './components/User/UserDashboard';
import StoreDashboard from './components/Store/StoreDashboard';
import PageNotFound from './components/PageNotFound';
import ChangePassword from './components/User/ChangePassword';
import StoreList from './components/User/StoreList';
import ChangePasswordStore from './components/Store/ChangePasswordStore';
import MyStoreRatings from './components/Store/MyStoreRatings';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='404' element={<PageNotFound />}></Route>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<SignUpForm />}></Route>

        <Route path='/admindashboard' element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }>
          <Route path='' element={<AdminHome />}></Route>
          <Route path='/admindashboard/users' element={<ManageUsers />}></Route>
          <Route path='/admindashboard/stores' element={<ManageStores />}></Route>
        </Route>

        <Route path='/userDashboard' element={
          <PrivateRoute allowedRoles={['user']}>
            <UserDashboard />
          </PrivateRoute>
        }>
          <Route path='' element={<StoreList />}></Route>
          <Route path='/userDashboard/changePassword' element={<ChangePassword />}></Route>
        </Route>

        <Route path='/storeDashboard' element={
          <PrivateRoute allowedRoles={['storeOwner']}>
            <StoreDashboard />
          </PrivateRoute>
        }>
          <Route path='' element={<MyStoreRatings />}></Route>
          <Route path='/storeDashboard/storeList' element={<StoreList />}></Route>
          <Route path='/storeDashboard/changePassword' element={<ChangePasswordStore />}></Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
