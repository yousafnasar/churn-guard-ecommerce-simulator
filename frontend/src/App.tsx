import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <Link to="/" className="text-xl font-semibold tracking-tight text-[#D71426]">
            Ecommerce Simulator
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="transition hover:text-[#D71426]">
              Products
            </Link>
            <Link to="/cart" className="transition hover:text-[#D71426]">
              Cart
            </Link>
            <Link to="/simulator" className="transition hover:text-[#D71426]">
              Simulator
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;