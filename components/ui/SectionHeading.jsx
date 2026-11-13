export default function SectionHeading({
  tag,
  title,
  subtitle,
  center = false,
  className = ''
}) {
  return (
    <div className={`space-y-3 ${center ? 'text-center max-w-2xl mx-auto' : 'max-w-xl'} ${className}`}>
      {tag && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium tracking-wider text-[#A1A1AA] uppercase bg-[#141414] border border-[#292929] rounded-full">
          <span className="text-[#F0883E]">//</span> {tag}
        </span>
      )}
      {title && (
        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#F5F5F5] tracking-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-[#A1A1AA] text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
