import { Link } from "react-router-dom";

export default function Logo({ index = true }) {
  if (index) {
    return (
      <img className="pl-14" src={"https://vet-on.s3.amazonaws.com/logo_small.png"} alt="VetOn Logo" />
    );
  } else {
    return (
      <Link to={"/"}>
        <img className="pl-14" src={"https://vet-on.s3.amazonaws.com/logo_small.png"} alt="VetOn Logo" />
      </Link>
    );
  }
}
