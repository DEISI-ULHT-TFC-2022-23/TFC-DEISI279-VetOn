import { useContext } from "react";
import { UserContext } from "../UserContext";
import Nav from "../components/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ContentAppointments from "../components/ContentAppointments";

export default function Appointments() {
  const { id, username, setId, setUsername } = useContext(UserContext);
  const navigate = useNavigate();

  async function logout() {
    navigate("/");
    await axios.get("/logout");
    window.location.reload(true);
    setId(null);
    setUsername(null);
  }

  return (
    <div>
      <Nav loggedIn={true} onClick={logout} index={false} />
      <ContentAppointments />
    </div>
  );
}
