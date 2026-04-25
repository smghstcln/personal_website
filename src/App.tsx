import { useEffect, useRef, useState } from 'react';
import { resumeData } from './data/resume';
import type { ExperienceItem, ProjectItem } from './data/resume';
import Schematic from './components/Schematics';
import { buildAgentGraph } from './scenes/heroScenes';
import { buildCareerArc } from './scenes/careerArc';

// ---------- Lightweight motion primitives (CSS + IntersectionObserver) ----------
function useInView<T extends Element>(
  ref: React.RefObject<T>,
  { threshold = 0.1, once = true }: { threshold?: number; once?: boolean } = {}
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        if (once) obs.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold, once]);
  return inView;
}

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  y?: number;
  as?: keyof JSX.IntrinsicElements;
}

function Reveal({
  as = 'div',
  delay = 0,
  y = 20,
  className = '',
  style = {},
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.15 });
  const Tag = as as React.ElementType;
  const merged: React.CSSProperties = {
    ...style,
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
    transition: `opacity 0.7s cubic-bezier(.2,.8,.2,1) ${delay}s, transform 0.7s cubic-bezier(.2,.8,.2,1) ${delay}s`,
    willChange: 'opacity, transform',
  };
  return <Tag ref={ref} className={className} style={merged} {...rest}>{children}</Tag>;
}

// useScrollProgress — progress 0..1 within a target element through the viewport
function useScrollProgress(ref: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    let raf = 0;
    function update() {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const scrolled = -r.top;
      setProgress(Math.max(0, Math.min(1, scrolled / Math.max(1, total))));
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
  return progress;
}

function useWindowScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, []);
  return y;
}

// ---------- 3D canvases ----------
function HeroCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: false });
  useEffect(() => {
    if (!inView || !ref.current) return;
    return buildAgentGraph(ref.current);
  }, [inView]);
  return <div ref={ref} className="hero-canvas absolute inset-0" />;
}

function ArcCanvas({ activeRef, items }: { activeRef: React.MutableRefObject<number>; items: ExperienceItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: false });
  useEffect(() => {
    if (!inView || !ref.current) return;
    return buildCareerArc(ref.current, () => activeRef.current, items);
  }, [inView, items, activeRef]);
  return <div ref={ref} className="arc-canvas absolute inset-0" />;
}

// ---------- Sections ----------
function Nav({ onContact }: { onContact: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex justify-between items-center" style={{ mixBlendMode: 'difference', color: 'white' }}>
      <a href="#top" className="font-mono text-[11px] tracking-[0.2em] uppercase">SF / 26</a>
      <div className="flex gap-7 text-[12px] font-mono uppercase tracking-[0.18em]">
        <a href="#work" className="nav-link hover:opacity-70">Work</a>
        <a href="#impact" className="nav-link hover:opacity-70">Impact</a>
        <a href="#stack" className="nav-link hover:opacity-70">Stack</a>
        <button onClick={onContact} className="nav-link hover:opacity-70">Contact</button>
      </div>
    </nav>
  );
}

function Hero({ onContact }: { onContact: () => void }) {
  const scrollY = useWindowScrollY();
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const fadeRange = vh * 0.6;
  const fade = Math.max(0, Math.min(1, 1 - scrollY / fadeRange));
  const lift = -Math.min(scrollY * 0.12, 60);

  return (
    <section id="top" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <HeroCanvas />
      </div>

      <div className="absolute top-0 left-0 right-0 px-6 md:px-10 pt-24 flex justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted z-10 pointer-events-none">
        <span>Vol. 04 / 2026 Edition</span>
        <span>Tel-Aviv ↔ Remote</span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-40 md:pt-44 pb-32" style={{ opacity: fade, transform: `translateY(${lift}px)` }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-secondary">
            Internal AI Lead · Lightblocks Labs / eOracle
          </span>
        </div>

        <div className="mb-12">
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-text-muted mb-3">⟶ Samuel Fitoussi</p>
          <h1
            className="reveal-h1 font-display font-semibold text-text-primary leading-[0.92] text-balance"
            style={{ fontSize: 'clamp(48px, 8.5vw, 112px)' }}
          >
            I build agentic <br />systems that <em className="italic font-normal text-primary">ship</em>.
          </h1>
        </div>

        <Reveal delay={0.35} y={12} className="grid md:grid-cols-12 gap-8 max-w-5xl">
          <div className="md:col-span-1 hidden md:block pt-3">
            <div className="h-px w-full bg-text-primary" />
          </div>
          <div className="md:col-span-7">
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed text-pretty">
              {resumeData.personal.sub}
            </p>
            <div className="flex flex-wrap gap-3 pt-8 items-center">
              <button
                onClick={onContact}
                className="group flex items-center gap-3 pl-5 pr-4 py-3 bg-text-primary text-white rounded-full hover:bg-primary transition-colors text-sm font-medium"
              >
                Get in touch
                <span className="inline-flex w-6 h-6 rounded-full bg-white/15 items-center justify-center group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
              <a
                href="#impact"
                className="px-5 py-3 rounded-full border border-line hover:border-text-primary transition-colors text-sm font-medium bg-white/40 backdrop-blur-sm"
              >
                See selected work
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="absolute left-0 right-0 bottom-0 z-10 border-t border-line bg-paper/90 backdrop-blur-sm">
        <div className="overflow-hidden">
          <div className="marquee-track inline-flex items-center gap-12 py-4 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.22em] text-text-secondary">
            {[...resumeData.metrics, ...resumeData.metrics, ...resumeData.metrics].map((m, i) => (
              <span key={i} className="inline-flex items-center gap-3">
                <span className="text-text-primary font-medium">{m.value}</span>
                <span className="text-text-muted">{m.label}</span>
                <span className="text-line">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CareerSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = resumeData.experience;
  const numItems = items.length;
  const SCROLL_PER_ITEM_VH = 90;
  const ENTRY_VH = 20;
  const EXIT_VH = 30;
  const trackHeight = 100 + ENTRY_VH + (numItems - 1) * SCROLL_PER_ITEM_VH + EXIT_VH;
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  useEffect(() => { activeRef.current = active; }, [active]);

  const progress = useScrollProgress(containerRef);
  useEffect(() => {
    const totalDist = trackHeight - 100;
    const scrolledVh = progress * totalDist;
    const adj = scrolledVh - ENTRY_VH;
    const idx = Math.max(0, Math.min(Math.floor(adj / SCROLL_PER_ITEM_VH), numItems - 1));
    setActive(idx);
  }, [progress, trackHeight, numItems]);

  const item = items[active];

  return (
    <section id="work" className="relative bg-paper border-t border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-12">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted mb-3">§ 01 — Trajectory</div>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-balance">Career arc.</h2>
          </div>
          <p className="text-text-secondary max-w-md text-base leading-relaxed text-pretty">
            Five years across protocol engineering, fintech, and applied AI. Scroll to walk through, or jump.
          </p>
        </div>
      </div>

      <div ref={containerRef} className="relative" style={{ height: `${trackHeight}vh` }}>
        <div className="sticky top-0 h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative aspect-[4/5] rounded-2xl border border-line bg-white/60 overflow-hidden">
                <ArcCanvas activeRef={activeRef} items={items} />
                <div className="absolute top-5 left-5 font-mono text-[10px] tracking-[0.22em] uppercase text-text-muted">Career arc / live</div>
                <div className="absolute top-5 right-5 font-mono text-[10px] tracking-[0.22em] uppercase text-text-muted">
                  {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </div>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`Go to ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${i === active ? 'bg-primary w-8' : i < active ? 'bg-primary/40 w-1.5' : 'bg-line w-1.5'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 relative">
              <article key={active} className="relative h-full anim-fade-up">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary mb-5">
                  <span className="w-6 h-px bg-primary" />
                  <span>{item.date}</span>
                  <span className="text-line">·</span>
                  <span className="text-text-muted">{item.location}</span>
                </div>
                <h3 className="font-display text-4xl md:text-5xl font-semibold leading-[1.05] mb-2 text-balance">{item.company}</h3>
                <p className="text-xl text-text-secondary mb-6 italic font-display">{item.role}</p>
                <p className="text-lg text-text-primary leading-relaxed mb-8 text-pretty max-w-2xl">{item.summary}</p>
                <ul className="space-y-3 mb-8 max-w-2xl">
                  {item.description.map((d, i) => (
                    <li key={i} className="flex gap-3 text-[15px] text-text-secondary leading-relaxed text-pretty">
                      <span className="font-mono text-text-muted shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map(t => (
                    <span key={t} className="px-3 py-1 border border-line text-text-secondary text-xs font-mono uppercase tracking-wider rounded-full">{t}</span>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactCard({ p, idx }: { p: ProjectItem; idx: number }) {
  const [hover, setHover] = useState(false);
  return (
    <Reveal
      as="article"
      delay={idx * 0.06}
      y={24}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="lift group relative bg-white border border-line rounded-2xl overflow-hidden"
    >
      <div className="relative grid grid-cols-12 gap-4 p-7 border-b border-line bg-paper/60">
        <div className="col-span-3">
          <div className="font-display text-6xl font-semibold leading-none text-text-primary">{p.n}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted mt-3">{p.role}</div>
        </div>
        <div className="col-span-9 relative h-[120px]">
          <div className={`absolute inset-0 transition-opacity duration-500 ${hover ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-right">
              <div className="font-display text-5xl font-semibold leading-none text-text-primary">{p.metricBig}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted mt-3">{p.metricSub}</div>
            </div>
          </div>
          <div className={`absolute inset-0 transition-opacity duration-500 ${hover ? 'opacity-100' : 'opacity-0'}`} aria-hidden={!hover}>
            <Schematic shape={p.shape} />
          </div>
        </div>
      </div>
      <div className="p-7">
        <h3 className="font-display text-2xl font-semibold mb-3 text-balance leading-tight">{p.title}</h3>
        <p className="text-text-secondary leading-relaxed text-[15px] mb-6 text-pretty">{p.description}</p>
        <div className="flex flex-wrap gap-2">
          {p.tech.map(t => (
            <span key={t} className="px-2.5 py-1 bg-paper border border-line text-text-secondary text-[11px] font-mono uppercase tracking-wider rounded-md">{t}</span>
          ))}
        </div>
      </div>
      <div className={`absolute left-0 right-0 top-0 h-px transition-all duration-500 ${hover ? 'bg-primary' : 'bg-transparent'}`} />
    </Reveal>
  );
}

function ImpactSection() {
  return (
    <section id="impact" className="relative bg-background border-t border-line py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12 md:mb-16">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted mb-3">§ 02 — Selected impact</div>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-balance">
              Four shipped <em className="italic font-normal">systems.</em>
            </h2>
          </div>
          <p className="text-text-secondary max-w-md text-base leading-relaxed text-pretty">
            Hover any card to swap the metric for the system schematic. Every number is a real outcome — no decks, no demos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {resumeData.projects.map((p, i) => <ImpactCard key={p.id} p={p} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

function StackSection() {
  return (
    <section id="stack" className="relative bg-paper border-t border-line py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12 md:mb-16">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted mb-3">§ 03 — Stack</div>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-balance">
              What I actually <em className="italic font-normal">ship.</em>
            </h2>
          </div>
          <p className="text-text-secondary max-w-md text-base leading-relaxed text-pretty">
            Four core capabilities, then everything else. The long list is below — useful for ATS, less useful for understanding what I do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden mb-16">
          {resumeData.capabilities.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.06} y={12} className="bg-white p-7 hover:bg-paper transition-colors">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-4">
                {String(i + 1).padStart(2, '0')} / {String(resumeData.capabilities.length).padStart(2, '0')}
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3 text-balance leading-tight">{c.title}</h3>
              <p className="text-text-secondary text-[14px] leading-relaxed mb-5 text-pretty">{c.blurb}</p>
              <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">{c.stack.join(' · ')}</div>
            </Reveal>
          ))}
        </div>

        <div className="border-t border-line pt-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted mb-8">Everything else</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {resumeData.skills.map(cat => (
              <div key={cat.category}>
                <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-primary mb-3">{cat.category}</h4>
                <p className="text-text-secondary text-[14px] leading-relaxed">{cat.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ onContact }: { onContact: () => void }) {
  return (
    <section id="contact" className="relative bg-ink text-white py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40 mb-6">§ 04 — Let's talk</div>
        <h2 className="font-display font-semibold text-balance leading-[0.95] mb-10" style={{ fontSize: 'clamp(48px, 9vw, 132px)' }}>
          Hiring for an<br /><em className="italic font-normal text-secondary">applied-AI</em> role?
        </h2>
        <div className="grid md:grid-cols-12 gap-8 max-w-4xl">
          <div className="md:col-span-1 hidden md:block pt-3"><div className="h-px w-full bg-white/30" /></div>
          <div className="md:col-span-11">
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-10 max-w-3xl text-pretty">
              I'm open to applied-AI, agent engineering, forward-deployed, and AI product-engineer roles. Currently in Tel-Aviv; happy to relocate or work remote for the right team.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${resumeData.personal.email}`}
                className="group inline-flex items-center gap-3 pl-5 pr-4 py-3 bg-white text-ink rounded-full hover:bg-primary hover:text-white transition-colors text-sm font-medium"
              >
                {resumeData.personal.email}
                <span className="inline-flex w-6 h-6 rounded-full bg-ink/10 group-hover:bg-white/15 items-center justify-center group-hover:translate-x-0.5 transition-all">→</span>
              </a>
              <a
                href={resumeData.personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-full border border-white/20 hover:border-white transition-colors text-sm font-medium"
              >
                LinkedIn
              </a>
              <button
                onClick={onContact}
                className="px-5 py-3 rounded-full border border-white/20 hover:border-white transition-colors text-sm font-medium"
              >
                Quick contact
              </button>
            </div>
          </div>
        </div>
        <div className="mt-24 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          <span>© {new Date().getFullYear()} Samuel Fitoussi</span>
          <span>Tel-Aviv ↔ Remote</span>
          <span>Last updated · Apr 2026</span>
        </div>
      </div>
    </section>
  );
}

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-8 max-w-md w-full z-10 border border-line shadow-2xl anim-pop">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary text-xl leading-none"
        >
          ×
        </button>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted mb-3">Get in touch</div>
        <h3 className="font-display text-3xl font-semibold mb-3 leading-tight">
          Open to <em className="italic font-normal">applied-AI</em> roles.
        </h3>
        <p className="text-text-secondary text-[15px] leading-relaxed mb-6">
          Happy to talk through what I've shipped — DD pipelines, NAV, multi-chain analytics. Reply within ~24h.
        </p>
        <div className="space-y-2">
          <a
            href={`mailto:${resumeData.personal.email}`}
            className="flex items-center gap-3 p-4 rounded-xl border border-line hover:border-primary transition-colors group"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted group-hover:text-primary">Email</div>
            <div className="flex-1 text-text-primary text-sm">{resumeData.personal.email}</div>
            <span className="text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all">→</span>
          </a>
          <a
            href={resumeData.personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-line hover:border-primary transition-colors group"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted group-hover:text-primary">LinkedIn</div>
            <div className="flex-1 text-text-primary text-sm">samuel-fitoussi</div>
            <span className="text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [contact, setContact] = useState(false);
  return (
    <div className="relative">
      <ContactModal open={contact} onClose={() => setContact(false)} />
      <Nav onContact={() => setContact(true)} />
      <main>
        <Hero onContact={() => setContact(true)} />
        <CareerSection />
        <ImpactSection />
        <StackSection />
        <ContactSection onContact={() => setContact(true)} />
      </main>
    </div>
  );
}

export default App;
