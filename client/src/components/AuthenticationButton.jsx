import { Link } from "react-router-dom";

export default function AuthenticationButton() {
  return (
    <div className="flex gap-4">
      <Link to={"/authentication"}>
        <button
          type="button"
          className="flex items-center gap-1 font-poppins border border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Login / Sign-Up
        </button>
      </Link>
    </div>
  );
}
