'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, CheckCircle2, ShieldCheck, ExternalLink, Calendar, Hash, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import CertificationCard from '../ui/CertificationCard';
import Button from '../ui/Button';
import { certificationsData } from '@/data/certifications';

export default function Certifications() {
  const [activeModalCert, setActiveModalCert] = useState(null);

  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse Drag State
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Update navigation button states
  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  // Horizontal mouse wheel scrolling exclusively on certification cards
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;

      if (maxScroll <= 0) return;

      if (e.deltaY !== 0) {
        const canScrollLeftward = scrollLeft > 0 && e.deltaY < 0;
        const canScrollRightward = scrollLeft < maxScroll && e.deltaY > 0;

        if (canScrollLeftward || canScrollRightward) {
          e.preventDefault();
          el.scrollLeft += e.deltaY * 1.2;
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Slide Left / Right programmatic controls
  const handleSlide = (direction) => {
    const el = sliderRef.current;
    if (!el) return;

    const cardWidth = 380;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    el.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  // Drag to scroll handlers
  const handleMouseDown = (e) => {
    const el = sliderRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const el = sliderRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <section id="certifications" className="py-20 sm:py-24 bg-[#090909] border-t border-[#292929] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeading
          // tag="Credentials & Training"
          title="Verified Certifications & Training"
          subtitle="Official technical qualifications, summer training, and industry credentials earned from recognized organizations."
          center
        />

        {/* Carousel Container with Left and Right Flanking Buttons */}
        <div className="relative group/carousel max-w-6xl mx-auto px-2 sm:px-6">
          {/* Left Arrow Button */}
          <button
            onClick={() => handleSlide('left')}
            disabled={!canScrollLeft}
            aria-label="Previous certificate"
            className="absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-[#141414]/90 backdrop-blur-md border border-[#292929] text-[#F5F5F5] hover:border-[#58A6FF] hover:text-[#58A6FF] hover:bg-[#1f1f1f] active:scale-95 disabled:opacity-0 disabled:pointer-events-none rounded-full transition-all shadow-xl"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => handleSlide('right')}
            disabled={!canScrollRight}
            aria-label="Next certificate"
            className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-[#141414]/90 backdrop-blur-md border border-[#292929] text-[#F5F5F5] hover:border-[#58A6FF] hover:text-[#58A6FF] hover:bg-[#1f1f1f] active:scale-95 disabled:opacity-0 disabled:pointer-events-none rounded-full transition-all shadow-xl"
          >
            <ChevronRight size={20} />
          </button>

          {/* Horizontal Slider Track */}
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-2 cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {certificationsData.map((cert, idx) => (
              <CertificationCard
                key={cert.id}
                cert={cert}
                index={idx}
                onOpenModal={(c) => setActiveModalCert(c)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Viewer Lightbox Modal */}
      <AnimatePresence>
        {activeModalCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalCert(null)}
              className="fixed inset-0 bg-[#090909]/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative w-full max-w-4xl bg-[#141414] border border-[#292929] rounded-2xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-[#191919] border-b border-[#292929] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-medium text-[#F0883E] uppercase tracking-wider">
                    {activeModalCert.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#F5F5F5]">
                    {activeModalCert.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58A6FF] font-medium flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-[#3FB950]" />
                    <span>{activeModalCert.organization}</span>
                  </p>
                </div>
                <button
                  onClick={() => setActiveModalCert(null)}
                  aria-label="Close modal"
                  className="p-2 text-[#A1A1AA] hover:text-[#F5F5F5] bg-[#292929] hover:bg-[#3F3F46] rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
                {/* High Resolution Certificate Image Preview */}
                <div className="relative w-full aspect-[16/11] max-h-[460px] rounded-xl overflow-hidden border border-[#292929] bg-[#090909] shadow-inner flex items-center justify-center">
                  <Image
                    src={activeModalCert.image}
                    alt={activeModalCert.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#191919] border border-[#292929] rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <UserCheck size={16} className="text-[#58A6FF] flex-shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase text-[#71717A] block">Recipient</span>
                      <strong className="text-[#F5F5F5]">{activeModalCert.recipient}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <Calendar size={16} className="text-[#F0883E] flex-shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase text-[#71717A] block">Issued Date</span>
                      <strong className="text-[#F5F5F5]">{activeModalCert.issueDate}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <Hash size={16} className="text-[#3FB950] flex-shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] uppercase text-[#71717A] block">Credential ID</span>
                      <strong className="text-[#F5F5F5] font-mono truncate block">{activeModalCert.credentialId}</strong>
                    </div>
                  </div>
                </div>

                {/* Description & Topics */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                    Credential Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                    {activeModalCert.description}
                  </p>
                </div>

                {activeModalCert.topics && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                      Skills & Topics Validated
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeModalCert.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2.5 py-1 text-xs font-mono bg-[#191919] text-[#A1A1AA] border border-[#292929] rounded-md"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 bg-[#191919] border-t border-[#292929] flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs text-[#3FB950] font-medium">
                  <CheckCircle2 size={16} className="text-[#3FB950]" />
                  <span>Verified by {activeModalCert.organization}</span>
                </div>

                <div className="flex items-center gap-2">
                  {activeModalCert.verificationLink && activeModalCert.verificationLink !== '#' && (
                    <Button href={activeModalCert.verificationLink} variant="primary" size="sm">
                      <ExternalLink size={15} /> Verify on Credly
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => setActiveModalCert(null)}>
                    Close Preview
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
