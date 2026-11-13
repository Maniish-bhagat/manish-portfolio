'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal, CheckCircle2, CornerDownLeft, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveTerminal() {
  const initialHistory = [
    {
      type: 'initial',
      content: (
        <div className="space-y-4">
          <div>
            <span className="text-[#71717A]">// Developer Profile Data</span>
            <br />
            <span className="text-[#F0883E]">const</span> <span className="text-[#E5E5E5]">developer</span> = &#123;
          </div>
          <div className="pl-4 space-y-1">
            <div>name: <span className="text-[#E5E5E5]">'Manish Bhagat'</span>,</div>
            <div>degree: <span className="text-[#E5E5E5]">'B.Tech Computer Science & Eng.'</span>,</div>
            <div>location: <span className="text-[#58A6FF]">'Chandigarh, India'</span>,</div>
            <div>status: <span className="text-[#3FB950]">'Open to Roles'</span>,</div>
            <div>primaryFocus: [<span className="text-[#58A6FF]">'Full-Stack Web'</span>, <span className="text-[#58A6FF]">'DSA'</span>],</div>
            <div>keyStack: [<span className="text-[#E5E5E5]">'Java'</span>, <span className="text-[#E5E5E5]">'React'</span>, <span className="text-[#E5E5E5]">'Next.js'</span>, <span className="text-[#E5E5E5]">'Node.js'</span>]</div>
          </div>
          <div>&#125;;</div>
          <div className="pt-2 border-t border-[#292929] text-xs">
            <span className="text-[#3FB950] flex items-center gap-1.5 font-sans">
              <CheckCircle2 size={14} /> Ready for software engineering opportunities
            </span>
          </div>
        </div>
      )
    }
  ];

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState(initialHistory);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const quickCommands = ['help', 'about', 'skills', 'projects', 'contact', 'clear', 'sudo hire'];

  // Scroll to bottom on output change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Track user command history for ArrowUp / ArrowDown
    setCommandHistory((prev) => [...prev, rawCmd.trim()]);
    setHistoryIndex(-1);

    if (cmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    let responseNode = null;

    switch (cmd) {
      case 'help':
        responseNode = (
          <div className="space-y-2 py-1 text-xs sm:text-sm">
            <div className="text-[#E5E5E5] font-semibold flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#F0883E]" /> Available Terminal Commands:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 text-[#8B8B8B]">
              <div><span className="text-[#58A6FF] font-semibold">about</span> : Background & summary</div>
              <div><span className="text-[#58A6FF] font-semibold">skills</span> : Tech stack & competencies</div>
              <div><span className="text-[#58A6FF] font-semibold">projects</span> : Key engineering projects</div>
              <div><span className="text-[#58A6FF] font-semibold">contact</span> : Email & social handles</div>
              <div><span className="text-[#58A6FF] font-semibold">resume</span> : View resume download link</div>
              <div><span className="text-[#58A6FF] font-semibold">sudo hire</span> : Send recruit offer 🚀</div>
              <div><span className="text-[#58A6FF] font-semibold">clear</span> : Clear screen output</div>
            </div>
          </div>
        );
        break;

      case 'about':
        responseNode = (
          <div className="space-y-1.5 py-1 text-xs sm:text-sm">
            <div className="text-[#F5F5F5] font-semibold">👋 Manish Bhagat</div>
            <div className="text-[#8B8B8B]">
              • Computer Science & Engineering student based in <span className="text-[#58A6FF]">Chandigarh</span>.
            </div>
            <div className="text-[#8B8B8B]">
              • Specializing in <span className="text-[#F0883E]">Full-Stack Web Development</span>, Data Structures & Algorithms in Java, and scalable web architectures.
            </div>
            <div className="text-[#8B8B8B]">
              • Hackathon team leader (SIH & Hacktopus) & open-source contributor.
            </div>
          </div>
        );
        break;

      case 'skills':
        responseNode = (
          <div className="space-y-2 py-1 text-xs sm:text-sm">
            <div className="text-[#F5F5F5] font-semibold">🛠 Technical Competencies:</div>
            <div className="space-y-1 pl-2 text-[#8B8B8B]">
              <div><span className="text-[#F0883E]">Languages:</span> Java, JavaScript (ES6+), C++, HTML5, CSS3</div>
              <div><span className="text-[#58A6FF]">Frontend:</span> React.js, Next.js, Tailwind CSS, Framer Motion</div>
              <div><span className="text-[#3FB950]">Backend & DB:</span> Node.js, Express.js, MongoDB, REST APIs, SQL</div>
              <div><span className="text-[#FFA657]">Core Fundamentals:</span> Data Structures & Algorithms, OOP, DBMS, OS, Computer Networks</div>
            </div>
          </div>
        );
        break;

      case 'projects':
        responseNode = (
          <div className="space-y-2 py-1 text-xs sm:text-sm">
            <div className="text-[#F5F5F5] font-semibold">🚀 Highlighted Projects:</div>
            <div className="space-y-2 pl-2 text-[#8B8B8B]">
              <div>
                <a href="#projects" className="text-[#58A6FF] hover:underline font-semibold">1. Full-Stack E-Commerce / Web Platform ↗</a>
                <p className="text-xs text-[#71717A]">Comprehensive full-stack portal with authentication, cart management, and payment integration.</p>
              </div>
              <div>
                <a href="#projects" className="text-[#58A6FF] hover:underline font-semibold">2. Krishi Mitra (SIH Hackathon Project) ↗</a>
                <p className="text-xs text-[#71717A]">Farmer assistance portal featuring real-time market data, crop advisory, and community hub.</p>
              </div>
            </div>
          </div>
        );
        break;

      case 'contact':
        responseNode = (
          <div className="space-y-1.5 py-1 text-xs sm:text-sm">
            <div className="text-[#F5F5F5] font-semibold">📫 Direct Contact Channels:</div>
            <div className="pl-2 space-y-1 text-[#8B8B8B]">
              <div>Email: <a href="mailto:manishkumar13builds@gmail.com" className="text-[#58A6FF] hover:underline">manishkumar13builds@gmail.com</a></div>
              <div>GitHub: <a href="https://github.com/Maniish-bhagat" target="_blank" rel="noopener noreferrer" className="text-[#58A6FF] hover:underline">@Maniish-bhagat</a></div>
              <div>LinkedIn: <a href="https://www.linkedin.com/in/mbg13/" target="_blank" rel="noopener noreferrer" className="text-[#58A6FF] hover:underline">in/mbg13/</a></div>
              <div>LeetCode: <a href="https://leetcode.com/u/maniish_bhagat/" target="_blank" rel="noopener noreferrer" className="text-[#F0883E] hover:underline">@maniish_bhagat</a></div>
            </div>
          </div>
        );
        break;

      case 'resume':
        responseNode = (
          <div className="py-1 text-xs sm:text-sm">
            <span className="text-[#3FB950]">📄 Resume:</span>{' '}
            <a
              href="/resume/Manish-Bhagat-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#58A6FF] underline font-semibold hover:text-[#79B8FF]"
            >
              Open Manish-Bhagat-Resume.pdf ↗
            </a>
          </div>
        );
        break;

      case 'sudo hire':
      case 'sudo hire-manish':
      case 'hire':
        responseNode = (
          <div className="p-3 bg-[#141414] border border-[#3FB950]/40 rounded-lg text-xs sm:text-sm space-y-1">
            <div className="text-[#3FB950] font-bold flex items-center gap-1.5">
              <CheckCircle2 size={16} /> [ACCESS GRANTED]: Engineering Offer Initialized! 🎉
            </div>
            <p className="text-[#E5E5E5]">
              Thank you for considering me! Let's build something exceptional together.
            </p>
            <p className="text-xs text-[#58A6FF]">
              Send a quick message via the form below or write to <a href="mailto:manishkumar13builds@gmail.com" className="underline font-mono">manishkumar13builds@gmail.com</a>.
            </p>
          </div>
        );
        break;

      default:
        responseNode = (
          <div className="text-xs sm:text-sm text-[#F85149]">
            zsh: command not found: {rawCmd}. Type <span className="text-[#58A6FF] font-semibold cursor-pointer underline" onClick={() => executeCommand('help')}>'help'</span> to see available commands.
          </div>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        type: 'command',
        command: rawCmd,
        content: responseNode,
      },
    ]);

    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setInputVal(commandHistory[commandHistory.length - 1 - nextIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      const match = quickCommands.find((c) => c.startsWith(current));
      if (match) setInputVal(match);
    }
  };

  const resetTerminal = () => {
    setHistory(initialHistory);
    setInputVal('');
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`bg-[#141414] border border-[#2d2d2d] rounded-xl shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-300 ${
        isExpanded ? 'max-h-[600px]' : 'max-h-[480px]'
      } flex flex-col`}
    >
      {/* macOS Terminal Window Bar */}
      <div className="bg-[#1a1a1a] px-4 py-3 border-b border-[#2d2d2d] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHistory([]);
            }}
            title="Clear output"
            className="w-3 h-3 rounded-full bg-[#FF5F57] hover:opacity-80 transition-opacity"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetTerminal();
            }}
            title="Reset Terminal"
            className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:opacity-80 transition-opacity"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            title={isExpanded ? 'Collapse' : 'Expand'}
            className="w-3 h-3 rounded-full bg-[#28C840] hover:opacity-80 transition-opacity"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-[#8B8B8B]">
          <Terminal size={14} className="text-[#F0883E]" />
          manish@portfolio ~ %
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            resetTerminal();
          }}
          title="Restart Terminal"
          className="text-[#71717A] hover:text-[#58A6FF] transition-colors p-0.5 rounded"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Terminal Output Body */}
      <div
        ref={scrollRef}
        className="p-4 sm:p-6 font-mono text-xs sm:text-sm space-y-4 text-[#8B8B8B] leading-relaxed flex-1 overflow-y-auto max-h-[380px]"
      >
        {history.map((item, index) => (
          <div key={index} className="space-y-2">
            {item.type === 'command' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#F0883E]">manish@portfolio ~ %</span>
                <span className="text-[#F5F5F5] font-semibold">{item.command}</span>
              </div>
            )}
            <div>{item.content}</div>
          </div>
        ))}

        {/* Live Input Line */}
        <div className="flex items-center gap-2 pt-2 text-xs sm:text-sm">
          <span className="text-[#F0883E] whitespace-nowrap">manish@portfolio ~ %</span>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type 'help' to see all commands..."
              className="w-full bg-transparent text-[#F5F5F5] placeholder-[#71717A]/70 outline-none border-none font-mono text-xs sm:text-sm"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <button
            onClick={() => executeCommand(inputVal)}
            className="p-1 text-[#71717A] hover:text-[#F0883E] transition-colors"
            title="Execute (Enter)"
          >
            <CornerDownLeft size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
