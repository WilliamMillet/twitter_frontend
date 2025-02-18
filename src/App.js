import logo from "./logo.svg";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";

import DashboardPage from "./Pages/DashboardPage/DashboardPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import SignupPage from "./Pages/SignupPage/SignupPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import SettingsPage from "./Pages/SettingsPage/SettingsPage";
import ViewPostPage from "./Pages/ViewPostPage/ViewPostPage";
import SearchPage from "./Pages/SearchPage/SearchPage";
import ViewReplyPage from "./Pages/ViewReplyPage/ViewReplyPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="posts/:id" element={<ViewPostPage />} />
        <Route path="replies/:id" element={<ViewReplyPage />} />
        <Route path="search/:query" element={<SearchPage />} />
      </Routes>
    </HashRouter>
  );
}require('dotenv').config();

export default App;
