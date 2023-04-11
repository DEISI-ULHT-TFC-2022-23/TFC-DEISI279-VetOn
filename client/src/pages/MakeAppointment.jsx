import { useContext } from "react";
import { UserContext } from "../UserContext";
import Nav from "../components/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ContentAppointments from "../components/ContentAppointments";

export default function MakeAppointment() {
  const { id, username, setId, setUsername } = useContext(UserContext);
  

  return (
    <div>ola</div>
  );
}
