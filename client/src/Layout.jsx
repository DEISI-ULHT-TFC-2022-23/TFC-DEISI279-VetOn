import { useContext } from "react";
import { UserContext } from "./UserContext";
import Nav from "./components/Nav";
import ContentIndex from "./components/ContentIndex";

export default function Layout() {
  const { username, setUserId, setUsername } = useContext(UserContext);

  async function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
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
