"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="navigation"
    >
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          🔐 Auth0 App
        </Link>
        <div className="nav-links">
          <Link 
            href="/" 
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/camera" 
            className={`nav-link ${pathname === '/camera' ? 'active' : ''}`}
          >
            📷 Camera Tool
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
