'use client';

import { Github, Linkedin, Code, Mail } from 'lucide-react';
import { socialLinksData } from '@/data/socialLinks';

export default function SocialLinks({ className = '', iconSize = 20, showLabels = false }) {
  const links = [
    { key: 'github', icon: Github, href: socialLinksData.github.url, label: socialLinksData.github.name, hoverColor: 'hover:text-[#58A6FF]' },
    { key: 'linkedin', icon: Linkedin, href: socialLinksData.linkedin.url, label: socialLinksData.linkedin.name, hoverColor: 'hover:text-[#58A6FF]' },
    { key: 'leetcode', icon: Code, href: socialLinksData.leetcode.url, label: socialLinksData.leetcode.name, hoverColor: 'hover:text-[#F0883E]' },
    { key: 'email', icon: Mail, href: socialLinksData.email.url, label: socialLinksData.email.name, hoverColor: 'hover:text-[#F0883E]' },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((item) => {
        const IconComponent = item.icon;
        return (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={`group p-2.5 bg-[#141414] border border-[#292929] text-[#A1A1AA] ${item.hoverColor} hover:border-[#3F3F46] hover:bg-[#191919] hover:scale-110 hover:-translate-y-0.5 active:scale-95 rounded-lg transition-all duration-200 shadow`}
          >
            <IconComponent size={iconSize} className="transition-transform duration-200" />
            {showLabels && <span className="ml-2 text-sm font-medium">{item.label}</span>}
          </a>
        );
      })}
    </div>
  );
}
