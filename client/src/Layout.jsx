import { useContext } from "react";
import { UserContext } from "./UserContext";
import Nav from "./components/Nav";
import ContentIndex from "./components/ContentIndex";
import axios from "axios";

export default function Layout() {
  const { id, username, setId, setUsername } = useContext(UserContext);

  async function logout() {
    await axios.get("/logout");
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
