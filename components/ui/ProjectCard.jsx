'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import Button from './Button';
import TechIcon from './TechIcon';

export default function ProjectCard({ project, index = 0, onOpenModal }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 3D Mouse-Follow Tilt (smooth 3.5° tilt following pointer coordinates)
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
      initial={{ opacity: 0, x: 50, scale: 0.94 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
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
          y: isHovered ? -6 : 0,
          scale: isHovered ? 1.015 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 22,
        }}
        className="group relative flex flex-col justify-between h-full w-[310px] sm:w-[370px] md:w-[400px] bg-[#141414] border border-[#292929] rounded-2xl overflow-hidden shadow-lg hover:border-[#3F3F46] hover:shadow-2xl transition-colors duration-300 select-none cursor-default"
      >
        {/* Image Banner */}
        <div
          onClick={() => onOpenModal?.(project)}
          className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#090909] cursor-pointer"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 310px, (max-width: 768px) 370px, 400px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />

          {project.badge && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-mono font-medium text-[#F0883E] bg-[#090909]/90 backdrop-blur-md border border-[#292929] rounded-full shadow">
              {project.badge}
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="flex flex-col flex-1 p-5 space-y-3">
          <h3
            onClick={() => onOpenModal?.(project)}
            className="text-lg sm:text-xl font-bold font-heading text-[#F5F5F5] group-hover:text-[#F0883E] transition-colors duration-300 line-clamp-1 cursor-pointer"
          >
            {project.title}
          </h3>

          <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed line-clamp-2 flex-1">
            {project.description}
          </p>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono bg-[#191919] text-[#A1A1AA] border border-[#292929] rounded-md transition-colors duration-200 group-hover:border-[#383838]"
              >
                <TechIcon name={tech} />
                <span>{tech}</span>
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-0.5 text-[11px] font-mono bg-[#191919] text-[#71717A] border border-[#292929] rounded-md">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Card Actions Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#242424]">
            <div className="flex items-center gap-1.5">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GitHub repository for ${project.title}`}
                  className="p-2 text-[#A1A1AA] hover:text-[#58A6FF] hover:bg-[#191919] rounded-lg transition-colors"
                >
                  <Github size={17} />
                </a>
              )}
              {project.liveUrl && project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Live demo for ${project.title}`}
                  className="p-2 text-[#A1A1AA] hover:text-[#58A6FF] hover:bg-[#191919] rounded-lg transition-colors"
                >
                  <ExternalLink size={17} />
                </a>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenModal?.(project)}
              className="group/btn text-xs text-[#58A6FF] hover:text-[#79B8FF] font-medium px-2.5 py-1.5"
            >
              Case Study
              <ArrowRight size={14} className="text-[#58A6FF] group-hover/btn:text-[#79B8FF] group-hover/btn:translate-x-1.5 transition-all duration-300" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
