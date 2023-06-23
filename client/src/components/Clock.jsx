export default function Clock({dateState}) {
  return (
    <div className="flex font-poppins text-2xl gap-2 pl-6">
      <div>
        {dateState.toLocaleDateString("pt", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
      <div className="border-l border-gray-500"></div>
      <div>
        {dateState.toLocaleString("pt", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        })}
      </div>
    </div>
  );
}
