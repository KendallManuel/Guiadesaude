"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", path: "/" },
    { name: "Analyzer", path: "/analyzer" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold font-sans text-indigo-600">
              DataAnalyzer
            </Link>
          </div>
          <div className="flex space-x-6">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.path ? "text-indigo-600" : "text-gray-600 hover:text-indigo-500"
                }`}
              >
                {link.name}
                {pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-600"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
