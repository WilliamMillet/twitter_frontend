import logo from './logo.svg';
import './App.css';
import {Routes, Route} from "react-router-dom"

import DashboardPage from './Pages/DashboardPage/DashboardPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import SignupPage from './Pages/SignupPage/SignupPage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import SettingsPage from './Pages/SettingsPage/SettingsPage';
import ViewPostPage from './Pages/ViewPostPage/ViewPostPage';
import SearchPage from './Pages/SearchPage/SearchPage';
import ViewReplyPage from './Pages/ViewReplyPage/ViewReplyPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<DashboardPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile/:username' element={<ProfilePage/>}/>
        <Route path='posts/:id' element={<ViewPostPage/>}></Route>
        <Route path='replies/:id' element={<ViewReplyPage/>}></Route>
        <Route path='search/:query' element={<SearchPage/>}></Route>
      </Routes>
    </div>
  );
}

export default App;


