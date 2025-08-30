import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-around">
        {/* Logo */}
        <div className="text-xl font-bold cursor-pointer">&lt; PassOp/&gt;</div>

        {/* Links */}
        <ul className="flex space-x-8 font-medium gap-6">
          <li>
            <a href="/" className="hover:text-gray-300 transition">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-gray-300 transition">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-gray-300 transition">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
