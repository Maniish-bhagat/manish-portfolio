'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, FileText } from 'lucide-react';
import Button from '../ui/Button';
import SocialLinks from '../ui/SocialLinks';
import SlideUp from '../animations/SlideUp';

import ParticleGlobe from '../effects/ParticleGlobe';

export default function Hero() {
  const roles = [
    'Full-Stack Developer',
    'Software Engineer',
    'Problem Solver',
    'Web Developer'
  ];

  const [currentRoleIdx, setCurrentRoleIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentRoleIdx((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [roles.length]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#090909]">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.10),transparent_38%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Text & Intro */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <SlideUp delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#141414] border border-[#292929] rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" />
              <span className="text-xs font-medium text-[#A1A1AA]">
                Computer Science & Engineering • Chandigarh
              </span>
            </div>
          </SlideUp>

          <SlideUp delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#F5F5F5] tracking-tight leading-[1.15]">
              Hi, I'm <span className="text-[#F0883E]">Manish Bhagat</span>
              <br />
              <span className="inline-flex items-center gap-2 text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#A1A1AA] mt-2 h-12">
                Aspiring{' '}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roles[currentRoleIdx]}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="text-[#58A6FF] font-mono"
                  >
                    {roles[currentRoleIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </SlideUp>

          <SlideUp delay={0.3}>
            <p className="text-[#A1A1AA] text-base sm:text-lg max-w-2xl leading-relaxed">
              Computer Science & Engineering student focused on building robust full-stack web applications, exploring Data Structures & Algorithms, and engineering scalable modern software solutions.
            </p>
          </SlideUp>

          <SlideUp delay={0.4}>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                href="#projects"
                variant="secondary"
                size="lg"
                className="group hover:border-[#58A6FF] hover:shadow-[0_0_20px_rgba(88,166,255,0.08)] transition-all duration-200"
              >
                <Rocket size={18} className="text-[#58A6FF] group-hover:text-[#79B8FF] transition-colors" />
                View Projects
              </Button>
              <Button
                href="/resume/Manish-Bhagat-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                className="group hover:border-[#3F3F46] transition-all duration-200"
              >
                <FileText size={18} className="text-[#58A6FF] group-hover:text-[#79B8FF] transition-colors" />
                View Resume
              </Button>
            </div>
          </SlideUp>

          <SlideUp delay={0.5}>
            <div className="pt-4 flex items-center gap-4 border-t border-[#292929]">
              <SocialLinks iconSize={21} />
            </div>
          </SlideUp>
        </div>

        {/* Right Column: Interactive 3D Rotating Particle Earth/Globe */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <SlideUp delay={0.4} className="w-full flex items-center justify-center">
            <ParticleGlobe />
          </SlideUp>
        </div>
      </div>
    </section>
  );
}
