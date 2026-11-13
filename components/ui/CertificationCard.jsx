'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award, Database, Cloud, Terminal, CheckCircle2, Eye, ShieldCheck, Cpu } from 'lucide-react';
import Button from './Button';

const iconMap = {
  Award,
  Database,
  Cloud,
  Terminal,
  Cpu,
};

export default function CertificationCard({ cert, index = 0, onOpenModal }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const IconComp = iconMap[cert.icon] || Award;

  // 3D Mouse-Follow Tilt (up to 3.5° towards cursor)
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 50,
        scale: 0.94,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 20,
        delay: index * 0.12,
      }}
      style={{ perspective: 1000 }}
      className="h-full flex-shrink-0 snap-start"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          y: isHovered ? -5 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 22,
        }}
        className="group relative flex flex-col justify-between h-full w-[300px] sm:w-[360px] md:w-[380px] bg-[#141414] border border-[#292929] rounded-2xl overflow-hidden shadow-lg hover:border-[#3F3F46] transition-colors duration-300 select-none cursor-default"
      >
        {/* Certificate Image Banner */}
        <div
          onClick={() => onOpenModal?.(cert)}
          className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#090909] cursor-pointer"
        >
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            sizes="(max-width: 640px) 300px, (max-width: 768px) 360px, 380px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />

          {/* Badge Pill */}
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-mono font-medium text-[#F0883E] bg-[#090909]/90 backdrop-blur-md border border-[#292929] rounded-full shadow">
            {cert.badge}
          </span>

          {/* Organization Icon Badge */}
          <div className="absolute top-3 left-3 p-2 bg-[#090909]/90 backdrop-blur-md border border-[#292929] text-[#F0883E] rounded-xl shadow">
            <IconComp size={18} />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col flex-1 p-5 space-y-3">
          <div>
            <h3 className="text-lg font-bold font-heading text-[#F5F5F5] group-hover:text-[#F0883E] transition-colors leading-snug line-clamp-1">
              {cert.title}
            </h3>
            <p className="text-xs font-semibold text-[#58A6FF] flex items-center gap-1.5 mt-1">
              <ShieldCheck size={14} className="text-[#3FB950]" />
              <span>{cert.organization}</span>
            </p>
          </div>

          <p className="text-[#A1A1AA] text-xs leading-relaxed line-clamp-2 flex-1">
            {cert.description}
          </p>

          {/* Card Actions Footer */}
          <div className="pt-3 border-t border-[#242424] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#3FB950] font-medium">
              <CheckCircle2 size={14} className="text-[#3FB950]" />
              <span className="text-[11px] text-[#A1A1AA] font-mono">{cert.issueDate}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenModal?.(cert)}
              className="group/btn text-xs text-[#58A6FF] hover:text-[#79B8FF] font-medium px-2.5 py-1.5"
            >
              <Eye size={14} className="text-[#58A6FF] group-hover/btn:text-[#79B8FF]" />
              View Certificate
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
