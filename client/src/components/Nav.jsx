import Logo from "./Logo";
import NavSections from "./NavSections";
import AuthenticationButton from "./AuthenticationButton";
import AuthenticatedButtons from "./AuthenticatedButtons";

export default function Nav({ loggedIn = false, onClick, index }) {
  if (!loggedIn) {
    return (
      <div className="fixed top-0 w-full">
        <nav className="flex items-center justify-between p-4 bg-gray-200">
          <Logo index={index} />
          <NavSections />
          <AuthenticationButton />
        </nav>
      </div>
    );
  } else {
    return (
      <div className="fixed top-0 w-full">
        <nav className="flex items-center justify-between p-4 bg-gray-200">
          <Logo index={index} />
          <NavSections />
          <AuthenticatedButtons onClick={onClick} />
        </nav>
      </div>
    );
  }
}
