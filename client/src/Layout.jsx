import { useContext } from "react";
import { UserContext } from "./UserContext";
import Nav from "./components/Nav";
import ContentIndex from "./components/ContentIndex";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Layout() {
  const { username, setUserId, setUsername } = useContext(UserContext);
  const navigate = useNavigate();

  async function logout() {
    await axios.get("/logout");
    navigate("/authentication");
    setUserId(null);
    setUsername(null);
  }

  if (username) {
    return (
      <div>
        <Nav loggedIn={true} onClick={logout} index={true} />
        <ContentIndex loggedIn={true} />
      </div>
    );
  } else {
    return (
      <div>
        <Nav />
        <ContentIndex />
      </div>
    );
  }
}
