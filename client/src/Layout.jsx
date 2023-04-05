import { useContext } from "react";
import { UserContext } from "./UserContext";
import Nav from "./components/Nav";
import Content from "./components/Content";
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
        <Nav username={true} onClick={logout} />
        <Content username={true} />
      </div>
    );
  } else {
    return (
      <div>
        <Nav />
        <Content />
      </div>
    );
  }
}
