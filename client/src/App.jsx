import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Authentication from "./pages/Authentication";
import MakeAppointment from "./pages/MakeAppointment";
import AddAnimal from "./pages/AddAnimal";
import Chat from "./pages/Chat";
import Layout from "./Layout";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import EditProfile from "./pages/EditProfile";
import ResetPassword from "./pages/ResetPassword";
import EditAnimal from "./pages/EditAnimal";
import Admin from "./pages/Admin";
import Support from "./pages/Support";
import AddDoctor from "./pages/AddDoctor";
import AddService from "./pages/AddService";
import MakeAppointmentAdmin from "./pages/MakeAppointmentAdmin";
import Doctor from "./pages/Doctor";

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes>
        <Route index element={<Layout />}></Route>
        <Route path="/authentication" element={<Authentication />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/reset-password/:id" element={<ResetPassword />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/doctor" element={<Doctor />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/support" element={<Support />}></Route>
        <Route path="/edit-profile" element={<EditProfile />}></Route>
        <Route path="/add-animal" element={<AddAnimal />}></Route>
        <Route path="/edit-animal/:id" element={<EditAnimal />}></Route>
        <Route path="/chat" element={<Chat />}></Route>
        <Route path="/make-appointment" element={<MakeAppointment />}></Route>
        <Route
          path="/make-appointment-admin"
          element={<MakeAppointmentAdmin />}
        ></Route>
        <Route path="/add-doctor" element={<AddDoctor />}></Route>
        <Route path="/add-service" element={<AddService />}></Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
