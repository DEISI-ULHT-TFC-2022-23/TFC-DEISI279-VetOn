import Avatar from "../components/Avatar";

export default function Client({
  clientId,
  username,
  onClick,
  selected,
  online,
}) {
  return (
    <div
      onClick={() => onClick(clientId)}
      key={clientId}
      className={
        "flex items-center gap-2 border-b border-gray-100 cursor-pointer " +
        (selected ? "bg-green-100" : "")
      }
    >
      {selected && <div className="w-1 bg-green-500 h-16 rounded-r-md"></div>}
      <div className="flex items-center gap-2 py-2 pl-2">
        <Avatar online={online} />
        <span>{username}</span>
      </div>
    </div>
  );
}
