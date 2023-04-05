export default function Avatar({ online }) {
  //ver como meter foto

  return (
    <div className="relative w-12 h-12 bg-red-200 rounded-full">
      {online && (
        <div className="absolute w-4 h-4 bg-[#0f0] rounded-full bottom-0 right-0 border border-white"></div>
      )}
      {!online && (
        <div className="absolute w-4 h-4 bg-gray-500 rounded-full bottom-0 right-0 border border-white"></div>
      )}
    </div>
  );
}
