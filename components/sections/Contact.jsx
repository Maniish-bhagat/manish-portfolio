'use client';

import { useState, useEffect } from 'react';
import { Send, User, Mail, Heading, MessageSquare, CheckCircle2, AlertCircle, Github, Linkedin, Code } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import SlideUp from '../animations/SlideUp';
import Button from '../ui/Button';
import { socialLinksData } from '@/data/socialLinks';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    hp_website: '',
  });

  const [cooldown, setCooldown] = useState(0);

  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    message: '',
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;
    setStatus({ submitting: true, success: null, message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          submitting: false,
          success: true,
          message: data.message || 'Message sent successfully.',
        });
        setFormData({ name: '', email: '', subject: '', message: '', hp_website: '' });
        setCooldown(45);
      } else {
        setStatus({
          submitting: false,
          success: false,
          message: data.error || 'Failed to send message. Please try again.',
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        submitting: false,
        success: false,
        message: 'Network error. Please try again later.',
      });
    }
  };

  const socialLinks = [
    {
      label: 'GitHub',
      url: socialLinksData.github.url,
      icon: Github,
      hoverColor: 'hover:text-[#58A6FF] hover:border-[#58A6FF]/40',
    },
    {
      label: 'LinkedIn',
      url: socialLinksData.linkedin.url,
      icon: Linkedin,
      hoverColor: 'hover:text-[#58A6FF] hover:border-[#58A6FF]/40',
    },
    {
      label: 'LeetCode',
      url: socialLinksData.leetcode.url,
      icon: Code,
      hoverColor: 'hover:text-[#F0883E] hover:border-[#F0883E]/40',
    },
    {
      label: 'Email',
      url: socialLinksData.email.url,
      icon: Mail,
      hoverColor: 'hover:text-[#3FB950] hover:border-[#3FB950]/40',
    },
  ];

  return (
    <section id="contact" className="py-24 bg-[#090909] border-t border-[#292929]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeading
          // tag="Reach Out"
          title="Let's Connect & Build Together"
          subtitle="Interested in recruitment, technical collaboration, or software development inquiry? Send a direct message."
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Direct Info & Minimal Social Logos */}
          <div className="lg:col-span-5 space-y-6">
            <SlideUp className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold font-heading text-[#F5F5F5] mb-2">
                  Get in Touch
                </h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                  Have a question, collaboration proposal, or software engineering opportunity? Feel free to reach out via the form or my social profiles.
                </p>
              </div>

              {/* Minimal Social Links - Logos Only */}
              <div className="pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#71717A] block mb-3">
                  Connect On
                </span>
                <div className="flex items-center gap-3">
                  {socialLinks.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        title={item.label}
                        className={`group p-3.5 bg-[#141414] border border-[#292929] text-[#A1A1AA] ${item.hoverColor} hover:bg-[#191919] hover:scale-110 hover:-translate-y-1 active:scale-95 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center`}
                      >
                        <IconComp size={22} className="transition-transform duration-300 group-hover:scale-110" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </SlideUp>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <SlideUp delay={0.2}>
              <div className="p-6 sm:p-8 bg-[#141414] border border-[#292929] rounded-2xl shadow-xl space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-heading text-[#F5F5F5]">Send Me a Message</h3>
                  <p className="text-[#A1A1AA] text-xs mt-1">
                    Fill out the form below to reach out directly to Manish Bhagat.
                  </p>
                </div>

                {status.message && (
                  <div
                    className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${status.success
                      ? 'bg-[#141414] border border-[#3FB950]/50 text-[#3FB950]'
                      : 'bg-[#141414] border border-[#F85149]/50 text-[#F85149]'
                      }`}
                  >
                    {status.success ? <CheckCircle2 size={20} className="text-[#3FB950]" /> : <AlertCircle size={20} className="text-[#F85149]" />}
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                        <User size={14} className="text-[#F0883E]" /> Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-2.5 bg-[#111111] border border-[#292929] text-[#F5F5F5] placeholder-[#71717A] rounded-xl text-sm focus:outline-none focus:border-[#58A6FF] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                        <Mail size={14} className="text-[#F0883E]" /> Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="sarah@firm.com"
                        className="w-full px-4 py-2.5 bg-[#111111] border border-[#292929] text-[#F5F5F5] placeholder-[#71717A] rounded-xl text-sm focus:outline-none focus:border-[#58A6FF] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                      <Heading size={14} className="text-[#F0883E]" /> Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Software Engineering Role / Project Inquiry"
                      className="w-full px-4 py-2.5 bg-[#111111] border border-[#292929] text-[#F5F5F5] placeholder-[#71717A] rounded-xl text-sm focus:outline-none focus:border-[#58A6FF] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A1A1AA] flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-[#F0883E]" /> Message
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi Manish, I came across your portfolio and wanted to connect..."
                      className="w-full px-4 py-2.5 bg-[#111111] border border-[#292929] text-[#F5F5F5] placeholder-[#71717A] rounded-xl text-sm focus:outline-none focus:border-[#58A6FF] transition-colors resize-none"
                    />
                  </div>

                  {/* Invisible Honeypot Anti-Bot Field */}
                  <input
                    type="text"
                    name="hp_website"
                    value={formData.hp_website || ''}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                    style={{ display: 'none' }}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={status.submitting || cooldown > 0}
                    className="w-full justify-center"
                  >
                    <Send size={18} />
                    {status.submitting
                      ? 'Sending Message...'
                      : cooldown > 0
                        ? `Please wait ${cooldown}s before sending another`
                        : 'Send Message'}
                  </Button>
                </form>
              </div>
            </SlideUp>
          </div>
        </div>
      </div>
    </section>
  );
}
