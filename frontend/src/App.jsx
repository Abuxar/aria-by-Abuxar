export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-light p-4">
      <div className="text-center p-8 border border-gray-800 rounded-2xl bg-black/50 shadow-2xl backdrop-blur-sm select-none hover:scale-[1.02] transition-transform duration-300 max-w-2xl w-full">
        <h1 className="text-6xl font-sans font-bold mb-4 tracking-tight">Aria<span className="text-gray-500">.</span></h1>
        <p className="text-lg font-mono text-gray-400 mb-8 mx-auto">
          E-Commerce React + Express Architecture
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
            Shop Collection
          </button>
          <button className="px-8 py-3 border border-gray-600 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors">
            Explore Admin
          </button>
        </div>
      </div>
    </div>
  )
}
