import { Calendar, Award, Code2, GraduationCap, Users, Rocket } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import SlideUp from '../animations/SlideUp';

export default function Journey() {
  const milestones = [
    {
      year: '2024',
      title: 'Diploma in Electronics Engineering',
      category: 'Academic Milestone',
      icon: GraduationCap,
      description: 'Completed Diploma in Electronics Engineering, building a strong foundation in hardware logic, embedded systems, and core analytical thinking before transitioning into Computer Science & Engineering.',
      tags: ['Electronics', 'Hardware Logic', 'Engineering Fundamentals']
    },
    {
      year: '2025',
      title: 'Full-Stack Web Dev & DSA',
      category: 'Technical Mastery',
      icon: Code2,
      description: 'Focused extensively on modern Web Development (React, Node.js, Express, MongoDB) alongside rigorous practice of Data Structures & Algorithms using Java. Built full-stack applications and cloned real-world software.',
      tags: ['React', 'Node.js', 'DSA with Java', 'REST APIs', 'MongoDB']
    },
    {
      year: '2025',
      title: 'Hackathon Team Leader - SIH & Hacktopus',
      category: 'Hackathons & Leadership',
      icon: Users,
      description: 'Led developer team in Smart India Hackathon (SIH) and Hacktopus hackathons. Architected problem-solving prototypes (including Krishi Mitra), managed team task distribution, and presented live technical demos.',
      tags: ['Smart India Hackathon', 'Hacktopus', 'Team Leadership', 'Krishi Mitra']
    },
    {
      year: '2026',
      title: 'Advanced Project Engineering & Interview Prep',
      category: 'Experience & Practice',
      icon: Rocket,
      description: 'Gaining hands-on development experience by building scalable full-stack projects, solving complex DSA problems, and actively preparing for technical software engineering interviews.',
      tags: ['Full-Stack Projects', 'Technical Interviews', 'DSA Practice', 'System Design']
    },
    {
      year: '2027',
      title: 'B.Tech CSE Graduation & Career Launch',
      category: 'Graduation Milestone',
      icon: GraduationCap,
      description: 'Completing B.Tech in Computer Science & Engineering in 2027. Continuously learning, leveraging project building experience and interview preparation to step into a high-impact software engineering career.',
      tags: ['B.Tech CSE 2027', 'Graduation', 'Software Engineer', 'Career Launch']
    }
  ];

  return (
    <section id="journey" className="py-24 bg-[#090909] border-t border-[#292929]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeading
          // tag="Developer Track"
          title="My Developer Journey"
          subtitle="Key academic milestones, hackathon leadership experiences, and software development growth timeline."
          center
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Timeline Bar */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-[#292929] -translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((item, idx) => {
              const IconComp = item.icon;
              const isEven = idx % 2 === 0;
              const isCompleted = item.year === '2024';

              return (
                <SlideUp key={idx} delay={idx * 0.15}>
                  <div className={`relative flex flex-col sm:flex-row items-start ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                    {/* Timeline Dot */}
                    <div className={`absolute left-4 sm:left-1/2 -translate-x-1/2 p-2 bg-[#090909] border-2 ${isCompleted ? 'border-[#3FB950] text-[#3FB950]' : 'border-[#F0883E] text-[#F0883E]'} rounded-full shadow-lg z-10`}>
                      <IconComp size={18} />
                    </div>

                    {/* Timeline Card */}
                    <div className={`w-full sm:w-1/2 pl-12 sm:pl-0 ${isEven ? 'sm:pr-10' : 'sm:pl-10'}`}>
                      <div className="p-6 bg-[#141414] border border-[#292929] rounded-xl space-y-3 shadow-md hover:border-[#3F3F46] transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 bg-[#191919] border border-[#292929] text-[#F0883E] rounded-md font-medium">
                            <Calendar size={12} />
                            {item.year}
                          </span>
                          <span className="text-xs text-[#A1A1AA] font-medium">
                            {item.category}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold font-heading text-[#F5F5F5]">
                          {item.title}
                        </h3>

                        <p className="text-[#A1A1AA] text-sm leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {item.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 text-[11px] font-mono bg-[#191919] text-[#A1A1AA] border border-[#292929] rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </SlideUp>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
