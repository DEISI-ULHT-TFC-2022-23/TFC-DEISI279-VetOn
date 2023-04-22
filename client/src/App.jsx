import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Authentication from "./pages/Authentication";
import Appointments from "./pages/Appointments";
import MakeAppointment from "./pages/MakeAppointment";
import AddAnimal from "./pages/AddAnimal";
import Chat from "./pages/Chat";
import Layout from "./Layout";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import EditProfile from "./pages/EditProfile";
import ResetPassword from "./pages/ResetPassword";

function App() {
  axios.defaults.baseURL = "http://localhost:4000/api";
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes>
        <Route index element={<Layout />}></Route>
        <Route path="/authentication" element={<Authentication />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route
          path="/reset-password/:id/:uniqueString"
          element={<ResetPassword />}
        ></Route>
        <Route path="/chat" element={<Chat />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/appointments" element={<Appointments />}></Route>
        <Route path="/make-appointment" element={<MakeAppointment />}></Route>
        <Route path="/add-animal/:id" element={<AddAnimal />}></Route>
        <Route path="/edit-profile/:id" element={<EditProfile />}></Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
