'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Code, Cpu, GraduationCap, Brain, Lightbulb } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import SlideUp from '../animations/SlideUp';

export default function About() {
  const sectionRef = useRef(null);

  // Scroll-based parallax physics for portrait
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothY = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), {
    stiffness: 90,
    damping: 22,
  });

  const smoothScale = useSpring(useTransform(scrollYProgress, [0, 0.45, 1], [0.94, 1.02, 0.95]), {
    stiffness: 90,
    damping: 22,
  });

  const smoothOpacity = useSpring(useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0.5, 1, 1, 0.7]), {
    stiffness: 90,
    damping: 22,
  });

  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.08, 0.94]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.08, 0.32, 0.10]);

  const highlightItems = [
    {
      icon: Code,
      title: 'Full-Stack Development',
      description: 'Building responsive frontend interfaces in React/Next.js backed by robust RESTful APIs in Node.js and Express.'
    },
    {
      icon: Brain,
      title: 'DSA & Problem Solving',
      description: 'Strengthening core algorithmic thinking, dynamic programming, tree traversal, and complex array manipulations in Java.'
    },
    {
      icon: Cpu,
      title: 'Computer Science Fundamentals',
      description: 'Grounded understanding of Object-Oriented Programming (OOP), DBMS, Operating Systems, and Networking principles.'
    },
    {
      icon: Lightbulb,
      title: 'Modern Technologies',
      description: 'Continuously experimenting with modern web frameworks, SQL & NoSQL data modeling, and practical developer tooling.'
    }
  ];

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-[#090909] border-t border-[#292929] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          // tag="Background & Focus"
          title="About Me"
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pt-2">
          {/* Frameless Integrated Profile Portrait with Scroll-Driven Parallax */}
          <div className="lg:col-span-5 flex justify-center lg:-mt-4">
            <SlideUp className="w-full max-w-lg flex flex-col items-center">
              <motion.div
                style={{ y: smoothY, scale: smoothScale, opacity: smoothOpacity }}
                className="relative w-full max-w-[480px] aspect-[1.18/1] flex items-center justify-center select-none group will-change-transform"
              >
                {/* Subtle, Soft Ambient Backlight Halo (Tuned Down) */}
                <motion.div
                  style={{ scale: glowScale, opacity: glowOpacity }}
                  className="absolute inset-4 bg-[radial-gradient(circle_at_50%_45%,rgba(240,136,62,0.10),transparent_70%)] blur-3xl pointer-events-none -z-10"
                />

                <Image
                  src="/images/profile/manish-profile.png"
                  alt="Manish Bhagat - Aspiring Software Engineer"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </motion.div>
            </SlideUp>
          </div>

          {/* Bio Text & Interest Cards (Spacious & Attractive) */}
          <div className="lg:col-span-7 space-y-8">
            <SlideUp delay={0.2} className="space-y-4 text-[#A1A1AA] leading-relaxed text-base">
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F5F5] tracking-tight leading-snug">
                Passionate about code, algorithmic efficiency, and useful software.
              </h3>
              <p>
                I enjoy turning ideas into practical software. As a Computer Science &amp; Engineering student, I spend my time building web applications, solving DSA problems, and learning how systems work under the hood. I like writing clean code, building useful products, and getting better with every project.
              </p>
              <p>
                Driven to contribute to high-impact engineering teams and build scalable software solutions that solve real-world challenges.
              </p>
            </SlideUp>

            {/* Interest Highlight Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {highlightItems.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <SlideUp key={item.title} delay={0.3 + idx * 0.1}>
                    <div className="p-5 bg-[#121212] border border-[#262626] rounded-2xl space-y-2.5 hover:border-[#F0883E]/40 hover:bg-[#161616] hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300 group/card">
                      <div className="p-2.5 w-fit bg-gradient-to-br from-[#1c1c1c] to-[#141414] border border-[#2e2e2e] text-[#F0883E] rounded-xl group-hover/card:scale-105 group-hover/card:border-[#F0883E]/50 transition-all">
                        <IconComp size={20} />
                      </div>
                      <h4 className="font-semibold text-[#F5F5F5] text-[15px] group-hover/card:text-[#FFA657] transition-colors">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">{item.description}</p>
                    </div>
                  </SlideUp>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
