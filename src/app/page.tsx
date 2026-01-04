// CLEANED UP - Removed duplicate containers (app-container, main-card-wrapper, action-card)
// Now using single home-container + main-card + action-section

'use client';

import { useEffect, useState } from "react";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import Profile from "@/components/Profile";
import SplineBackground from "@/components/SplineBackground";
import Navigation from "@/components/Navigation";

interface User {
  name?: string;
  email?: string;
  picture?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          if (data && !showSuccess) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <>
      <SplineBackground />
      <Navigation />
      
      <div className="home-container">
        <div className="main-card">
          <img
            src="https://cdn.auth0.com/quantum-assets/dist/latest/logos/auth0/auth0-lockup-en-ondark.png"
            alt="Auth0 Logo"
            className="auth0-logo"
          />
          <h1 className="main-title">Authenticate</h1>
          
          {loading ? (
            <div className="action-section">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="action-section">
              {user ? (
                <div className="logged-in-section">
                  {showSuccess && (
                    <div className="success-notification">
                      ✓ Successfully Authenticated
                    </div>
                  )}
                  <Profile />
                  <LogoutButton />
                </div>
              ) : (
                <>
                  <p className="action-text">
                    Get started by authenticating with your account
                  </p>
                  <LoginButton />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
