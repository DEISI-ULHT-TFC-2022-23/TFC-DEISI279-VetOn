import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to={"/"}>
      <img src="./src/assets/logo.png" alt="VetOn Logo" />
    </Link>
  );
}
