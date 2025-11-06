"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, Calendar, Cloud, Package, Info, Settings, Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  
  const navItems = [
    { href: "/", label: t.nav.overview, icon: Bike },
    { href: "/itinerary", label: t.nav.itinerary, icon: Calendar },
    { href: "/weather", label: t.nav.weather, icon: Cloud },
    { href: "/packing", label: t.nav.packing, icon: Package },
    { href: "/notes", label: t.nav.notes, icon: Info },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh-TW' : 'en');
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="font-playfair text-lg sm:text-xl font-semibold text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              {language === 'zh-TW' ? '沖繩單車之旅' : 'Okinawa Bike Tour'}
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Admin + Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="hidden sm:flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                title={language === 'en' ? '切換到繁體中文' : 'Switch to English'}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden lg:inline">{language === 'en' ? 'EN' : '繁'}</span>
              </button>
              <Link
                href="/admin"
                className="hidden sm:flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden lg:inline">{t.nav.admin}</span>
              </Link>
              
              {/* Mobile Menu Button (for additional options) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu (for language and admin) */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-4 space-y-1">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full"
                >
                  <Globe className="w-5 h-5" />
                  <span>{language === 'en' ? '繁體中文' : 'English'}</span>
                </button>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Settings className="w-5 h-5" />
                  <span>{t.nav.admin}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg min-w-0 flex-1 transition-colors ${
                  active
                    ? "text-gray-900"
                    : "text-gray-600"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : ''}`} />
                <span className={`text-xs font-medium truncate w-full text-center ${active ? 'text-blue-600' : ''}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

    </>
  );
}

