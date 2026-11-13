import SocialLinks from '../ui/SocialLinks';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-[#090909] border-t border-[#292929] pt-16 pb-12 text-[#A1A1AA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">
          <div className="space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F5F5]">
              Let's build something useful.
            </h3>
            <p className="text-[#A1A1AA] text-sm max-w-md">
              Computer Science & Engineering Student passionate about web development, DSA, and modern software craftsmanship.
            </p>
          </div>

          <div className="flex flex-col md:items-end space-y-4">
            <span className="text-sm font-medium text-[#F5F5F5]">Connect across platforms</span>
            <SocialLinks iconSize={20} />
          </div>
        </div>

        {/* Links Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#292929] text-sm">
          <div>
            <h4 className="font-semibold text-[#F5F5F5] mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-[#58A6FF] transition-colors">About Me</a></li>
              <li><a href="#skills" className="hover:text-[#58A6FF] transition-colors">Tech Matrix</a></li>
              <li><a href="#projects" className="hover:text-[#58A6FF] transition-colors">Projects</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#F5F5F5] mb-3">Professional</h4>
            <ul className="space-y-2">
              <li><a href="#journey" className="hover:text-[#58A6FF] transition-colors">Developer Journey</a></li>
              <li><a href="#certifications" className="hover:text-[#58A6FF] transition-colors">Certifications</a></li>
              <li><a href="#contact" className="hover:text-[#58A6FF] transition-colors">Get In Touch</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#F5F5F5] mb-3">Coding Profiles</h4>
            <ul className="space-y-2">
              <li><a href="https://github.com/manishbhagat-dev" target="_blank" rel="noopener noreferrer" className="hover:text-[#58A6FF] transition-colors">GitHub Repositories</a></li>
              <li><a href="https://leetcode.com/u/manishbhagat/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0883E] transition-colors">LeetCode Profile</a></li>
              <li><a href="https://linkedin.com/in/manishbhagat-dev" target="_blank" rel="noopener noreferrer" className="hover:text-[#58A6FF] transition-colors">LinkedIn Network</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#F5F5F5] mb-3">Status</h4>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#292929] text-[#3FB950] text-xs font-medium rounded-full font-mono">
                <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" />
                Open for Tech Opportunities
              </div>
              <p className="text-xs text-[#71717A]">Graduating 2027 • B.Tech CSE</p>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#292929] text-xs text-[#71717A]">
          <p>© {currentYear} Manish Bhagat. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with passion by Manish Bhagat
          </p>
        </div>
      </div>
    </footer >
  );
}
