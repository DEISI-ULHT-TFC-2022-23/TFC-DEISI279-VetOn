import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Authentication from "./pages/Authentication";
import Appointments from "./pages/Appointments";
import MakeAppointment from "./pages/MakeAppointment";
import Chat from "./pages/Chat";
import Layout from "./Layout";
import Profile from "./pages/Profile";

function App() {
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes>
        <Route index element={<Layout />}></Route>
        <Route path="/authentication" element={<Authentication />}></Route>
        <Route path="/chat" element={<Chat />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/appointments" element={<Appointments />}></Route>
        <Route path="/make-appointment" element={<MakeAppointment />}></Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
