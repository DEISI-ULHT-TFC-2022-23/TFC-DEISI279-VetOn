import Logo from "./Logo";
import NavSections from "./NavSections";
import AuthenticationButton from "./AuthenticationButton";
import AuthenticatedButtons from "./AuthenticatedButtons";

export default function Nav({ loggedIn = false, onClick }) {
  if (!loggedIn) {
    return (
      <div className="fixed top-0 w-full">
        <nav className="flex items-center justify-between p-4 bg-gray-200">
          <Logo />
          <NavSections />
          <AuthenticationButton />
        </nav>
      </div>
    );
  } else {
    return (
      <div className="fixed top-0 w-full">
        <nav className="flex items-center justify-between p-4 bg-gray-200">
          <Logo />
          <NavSections />
          <AuthenticatedButtons onClick={onClick} />
        </nav>
      </div>
    );
  }
}
