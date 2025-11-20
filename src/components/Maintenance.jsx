export default function Maintenance() {
  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
        🚧 Under Maintenance 🚧
      </h1>

      <p className="text-gray-300 text-lg md:text-xl max-w-xl">
        Our website is currently undergoing scheduled maintenance. We’ll be back
        shortly — thank you for your patience!
      </p>

      <div className="mt-10 animate-spin rounded-full h-16 w-16 border-b-4 border-green-400"></div>
    </div>
  );
}
