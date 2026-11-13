'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2, Send } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero', id: 'hero' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Journey', href: '#journey', id: 'journey' },
    { name: 'Certifications', href: '#certifications', id: 'certifications' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  // Scroll active section tracking via IntersectionObserver & hash sync
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // If page is refreshed with a hash in URL (e.g. #projects), scroll to it
    if (window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const el = document.getElementById(hashId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(hashId);
        }, 150);
      }
    }

    const sectionIds = navLinks.map((link) => link.id);
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          if (window.location.hash !== `#${entry.target.id}`) {
            window.history.replaceState(null, '', `#${entry.target.id}`);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header
        className={`pointer-events-auto w-full max-w-5xl rounded-full transition-all duration-300 border shadow-2xl ${
          isScrolled
            ? 'bg-[#090909]/70 border-white/[0.12] py-2 sm:py-2.5 px-4 sm:px-6 shadow-black/50 backdrop-blur-2xl'
            : 'bg-[#090909]/45 border-white/[0.08] py-2.5 sm:py-3 px-4 sm:px-6 backdrop-blur-xl'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo / Avatar */}
          <Link
            href="#hero"
            onClick={() => setActiveSection('hero')}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#292929] bg-[#141414] group-hover:border-[#58A6FF]/60 transition-colors shadow-sm">
              <Image
                src="/images/profile/manish-nav-avatar.png"
                alt="Manish Bhagat Avatar"
                fill
                className="object-cover object-top"
              />
            </div>
            <span className="font-heading font-bold text-base sm:text-lg text-[#58A6FF] tracking-tight">
              Manish Bhagat
            </span>
          </Link>

          {/* Desktop Navigation Links with Animated Glass Pill */}
          <nav className="hidden lg:flex items-center gap-1 bg-transparent p-1 rounded-full relative">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setActiveSection(link.id)}
                  className={`relative px-3.5 py-1.5 text-sm sm:text-base font-medium rounded-full transition-all duration-200 border ${
                    isActive
                      ? 'text-[#F0883E] font-semibold border-transparent'
                      : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/[0.08] hover:border-white/[0.15] border-transparent backdrop-blur-sm'
                  }`}
                >
                  {/* Floating Transparent Glass Capsule Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-[#F0883E]/10 border border-[#F0883E]/30 rounded-full shadow-inner backdrop-blur-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Connect Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button
                href="#contact"
                size="sm"
                className="rounded-full text-sm sm:text-base font-medium px-4 py-2 bg-[#58A6FF]/15 hover:bg-[#58A6FF]/25 text-[#58A6FF] hover:text-[#79B8FF] border border-[#58A6FF]/30 hover:border-[#58A6FF]/50 shadow-none hover:shadow-none transition-all duration-200"
              >
                <Send size={15} className="text-[#58A6FF]" />
                Connect
              </Button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 text-[#A1A1AA] hover:text-[#F5F5F5] bg-transparent border border-[#292929] rounded-full focus:outline-none hover:bg-white/[0.08] hover:border-white/[0.15] transition-all"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-3 pt-3 border-t border-[#292929] space-y-1.5 pb-2 bg-[#141414]/95 backdrop-blur-xl rounded-2xl p-4"
            >
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => {
                      setActiveSection(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`block px-4 py-2.5 text-base font-medium rounded-full transition-all ${
                      isActive
                        ? 'bg-[#F0883E]/15 text-[#F0883E] border border-[#F0883E]/30 backdrop-blur-md'
                        : 'text-[#A1A1AA] hover:bg-white/[0.08] hover:text-[#F5F5F5] border border-transparent'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              <div className="pt-2">
                <Button
                  href="#contact"
                  size="md"
                  className="w-full justify-center rounded-full text-base font-medium bg-[#58A6FF]/15 hover:bg-[#58A6FF]/25 text-[#58A6FF] hover:text-[#79B8FF] border border-[#58A6FF]/30 shadow-none hover:shadow-none transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Send size={16} className="text-[#58A6FF]" />
                  Connect With Me
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
