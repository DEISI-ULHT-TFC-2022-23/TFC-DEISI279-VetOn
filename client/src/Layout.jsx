import { useContext } from "react";
import { UserContext } from "./UserContext";
import Nav from "./components/Nav";
import ContentIndex from "./components/ContentIndex";
import axios from "axios";

export default function Layout() {
  const { username, setId, setUsername } = useContext(UserContext);

  async function logout() {
    await axios.get("/authentication/logout");
    window.location.reload(true);
    setId(null);
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
