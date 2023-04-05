import Logo from "./Logo";
import NavSections from "./NavSections";
import AuthenticationButton from "./AuthenticationButton";
import AuthenticatedButtons from "./AuthenticatedButtons";

export default function Nav({ username = false, onClick }) {
  if (!username) {
    return (
      <nav className="flex items-center justify-between p-4 border-b border-gray-200">
        <Logo />
        <NavSections />
        <AuthenticationButton />
      </nav>
    );
  } else {
    return (
      <nav className="flex items-center justify-between p-4 border-b border-gray-200">
        <Logo />
        <NavSections />
        <AuthenticatedButtons onClick={onClick} />
      </nav>
    );
  }
}
