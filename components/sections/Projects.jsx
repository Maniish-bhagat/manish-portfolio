'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Github, ExternalLink, CheckCircle2, AlertCircle, Wrench, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import ProjectCard from '../ui/ProjectCard';
import Button from '../ui/Button';
import TechIcon from '../ui/TechIcon';
import { projectsData } from '@/data/projects';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProject, setActiveModalProject] = useState(null);

  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse Drag State
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const categories = [
    { label: 'All Projects', value: 'all' },
    { label: 'Full-Stack Web', value: 'fullstack' },
  ];

  const filteredProjects = projectsData.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

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
  }, [filteredProjects, updateScrollState]);

  // Horizontal mouse wheel scrolling exclusively on project cards
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

    const cardWidth = 390;
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
    <section id="projects" className="py-16 sm:py-20 bg-[#090909] border-t border-[#292929] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            // tag="Portfolio Showcase"
            title="Featured Engineering Projects"
            subtitle="Genuine full-stack applications, real-world web portals, and software implementations."
          />

          {/* Search & Slider Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="w-full sm:w-64 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2 bg-[#141414] border border-[#292929] text-[#F5F5F5] placeholder-[#71717A] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#58A6FF] transition-colors"
              />
            </div>

            {/* Left / Right Slider Navigation Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleSlide('left')}
                disabled={!canScrollLeft}
                aria-label="Previous project"
                className="p-2.5 bg-[#141414] border border-[#292929] text-[#F5F5F5] hover:border-[#58A6FF] hover:text-[#58A6FF] hover:bg-[#1a1a1a] active:scale-95 disabled:opacity-30 disabled:pointer-events-none rounded-xl transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => handleSlide('right')}
                disabled={!canScrollRight}
                aria-label="Next project"
                className="p-2.5 bg-[#141414] border border-[#292929] text-[#F5F5F5] hover:border-[#58A6FF] hover:text-[#58A6FF] hover:bg-[#1a1a1a] active:scale-95 disabled:opacity-30 disabled:pointer-events-none rounded-xl transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${selectedCategory === cat.value
                  ? 'bg-[#F5F5F5] text-[#090909] font-semibold'
                  : 'bg-[#141414] border border-[#292929] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#3F3F46]'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Horizontal Slider Project Cards Carousel */}
        {filteredProjects.length > 0 ? (
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-2 cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                onOpenModal={(p) => setActiveModalProject(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#141414] border border-[#292929] rounded-xl space-y-3">
            <p className="text-[#A1A1AA] text-sm">No projects found matching your search query.</p>
            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
              Clear Search Filter
            </Button>
          </div>
        )}
      </div>

      {/* Case Study / Project Detail Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalProject(null)}
              className="fixed inset-0 bg-[#090909]/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#141414] border border-[#292929] rounded-2xl shadow-2xl overflow-hidden z-10 my-8"
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 bg-[#191919] border-b border-[#292929] flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-medium text-[#F0883E] uppercase tracking-wider">
                    {activeModalProject.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F5F5] mt-1">
                    {activeModalProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="p-2 text-[#A1A1AA] hover:text-[#F5F5F5] bg-[#292929] hover:bg-[#3F3F46] rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-[#A1A1AA] text-sm leading-relaxed">
                {activeModalProject.caseStudy && (
                  <>
                    <div className="space-y-2">
                      <h4 className="text-[#F5F5F5] font-bold font-heading flex items-center gap-2 text-base">
                        <AlertCircle size={18} className="text-[#F0883E]" />
                        Problem & Motivation
                      </h4>
                      <p className="text-[#A1A1AA]">{activeModalProject.caseStudy.problem}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[#F5F5F5] font-bold font-heading flex items-center gap-2 text-base">
                        <CheckCircle2 size={18} className="text-[#3FB950]" />
                        Solution Architecture
                      </h4>
                      <p className="text-[#A1A1AA]">{activeModalProject.caseStudy.solution}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[#F5F5F5] font-bold font-heading flex items-center gap-2 text-base">
                        <Wrench size={18} className="text-[#58A6FF]" />
                        Key Features
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-[#A1A1AA] pl-2">
                        {activeModalProject.caseStudy.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[#F5F5F5] font-bold font-heading flex items-center gap-2 text-base">
                        <Trophy size={18} className="text-[#FFA657]" />
                        My Role & Result
                      </h4>
                      <p><strong className="text-[#F5F5F5]">Role:</strong> {activeModalProject.caseStudy.myRole}</p>
                      <p><strong className="text-[#F5F5F5]">Challenges Handled:</strong> {activeModalProject.caseStudy.challenges}</p>
                      <p><strong className="text-[#F5F5F5]">Result:</strong> {activeModalProject.caseStudy.result}</p>
                    </div>
                  </>
                )}

                {/* Tech Badges */}
                <div className="pt-4 border-t border-[#292929] space-y-2">
                  <span className="text-xs font-semibold text-[#71717A] uppercase">Technologies Used</span>
                  <div className="flex flex-wrap gap-2">
                    {activeModalProject.technologies.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono bg-[#191919] text-[#A1A1AA] border border-[#292929] rounded-md">
                        <TechIcon name={t} />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Links */}
              <div className="p-6 bg-[#191919] border-t border-[#292929] flex items-center justify-end gap-3">
                {activeModalProject.githubUrl && (
                  <Button href={activeModalProject.githubUrl} variant="secondary" size="sm">
                    <Github size={16} /> View Code on GitHub
                  </Button>
                )}
                {activeModalProject.liveUrl && activeModalProject.liveUrl !== '#' && (
                  <Button href={activeModalProject.liveUrl} variant="primary" size="sm">
                    <ExternalLink size={16} /> Open Live Demo
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
