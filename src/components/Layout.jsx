import { Link } from "react-router-dom";
import { useState } from "react";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-sans flex flex-col min-h-screen">
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">Dentiste Équin</h1>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-white focus:outline-none"
          >
            ☰
          </button>

          <nav className="hidden sm:flex space-x-4">
            <Link to="/" className="hover:underline">
              Accueil
            </Link>
            <Link to="/about" className="hover:underline">
              À propos
            </Link>
            <Link to="/zones" className="hover:underline">
              Zones
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
          </nav>
        </div>

        {menuOpen && (
          <div className="sm:hidden mt-2 px-4 space-y-2">
            <Link
              to="/"
              className="block hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/about"
              className="block hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              to="/zones"
              className="block hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Zones
            </Link>
            <Link
              to="/contact"
              className="block hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-blue-900 text-white text-center py-4 mt-8">
        <p>&copy; 2025 Dentiste Équin. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
