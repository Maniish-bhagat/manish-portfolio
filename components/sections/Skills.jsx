'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Layout, Server, Database, Wrench, BookOpen, Layers } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import SlideUp from '../animations/SlideUp';
import { skillsData } from '@/data/skills';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categoryIcons = {
    Languages: Code2,
    Frontend: Layout,
    Backend: Server,
    Database: Database,
    Tools: Wrench,
    'Computer Science': BookOpen,
  };

  const categories = ['All', ...skillsData.map((s) => s.category)];

  const filteredData = activeCategory === 'All'
    ? skillsData
    : skillsData.filter((item) => item.category === activeCategory);

  return (
    <section id="skills" className="py-24 bg-[#090909] border-t border-[#292929]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          // tag="Competencies"

          title="Technical Skills & CS Core"
          subtitle="Categorized breakdown of programming languages, web technologies, tools, and theoretical fundamentals."
          center
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeCategory === cat
                ? 'bg-[#F5F5F5] text-[#090909] font-semibold shadow-md'
                : 'bg-[#141414] border border-[#292929] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#3F3F46]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((categoryGroup, idx) => {
            const IconComp = categoryIcons[categoryGroup.category] || Layers;
            return (
              <SlideUp key={categoryGroup.category} delay={idx * 0.1}>
                <div className="h-full p-6 bg-[#141414] border border-[#292929] rounded-xl space-y-4 hover:border-[#3F3F46] transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#191919] border border-[#292929] text-[#F0883E] rounded-lg group-hover:text-[#FFA657] group-hover:border-[#3F3F46] transition-colors">
                      <IconComp size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-heading text-[#F5F5F5]">
                        {categoryGroup.category}
                      </h3>
                      <p className="text-xs text-[#A1A1AA]">
                        {categoryGroup.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {categoryGroup.skills.map((skill) => (
                      <motion.div
                        key={skill.name}
                        whileHover={{ x: 4 }}
                        className="p-3 bg-[#191919] border border-[#292929] rounded-lg hover:border-[#3F3F46] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-[#E4E4E7]">
                            {skill.name}
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 bg-[#141414] text-[#FFA657] border border-[#292929] rounded">
                            {skill.level}
                          </span>
                        </div>
                        <p className="text-xs text-[#A1A1AA] mt-1">
                          {skill.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </SlideUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
