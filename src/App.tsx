import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Linkedin, 
  Mail, 
  MapPin,
  ChevronRight,
  X
} from 'lucide-react';
import { resumeData } from './data/resume';
import Scene from './components/Scene';
import BlockchainExperience from './components/BlockchainExperience';
import NeuralSkills from './components/NeuralSkills';
import ChessGallery from './components/ChessGallery';

function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Get in Touch</h3>
        <p className="text-slate-500 mb-6">I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
        
        <div className="space-y-3">
          <a 
            href={`mailto:${resumeData.personal.email}`}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-slate-50 transition-all group"
          >
            <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
              <Mail size={20} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">Email Me</div>
              <div className="text-xs text-slate-500">{resumeData.personal.email}</div>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
          </a>

          <a 
            href={resumeData.personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#0077b5] hover:bg-slate-50 transition-all group"
          >
            <div className="p-2 bg-[#0077b5]/10 text-[#0077b5] rounded-lg group-hover:bg-[#0077b5] group-hover:text-white transition-colors">
              <Linkedin size={20} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">LinkedIn</div>
              <div className="text-xs text-slate-500">Connect professionally</div>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-[#0077b5] transition-colors" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function App() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [activeTab, setActiveTab] = useState('experience');
  const [activeJobIndex, setActiveJobIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Scroll logic for Experience section
  const experienceContainerRef = useRef<HTMLDivElement>(null);
  const numExperiences = resumeData.experience.length;
  
  // SCROLL CONFIGURATION
  // Each job gets this much scroll distance (in vh) before transitioning
  const SCROLL_PER_ITEM_VH = 100;
  // Buffer at start before first transition and at end after last item
  const ENTRY_BUFFER_VH = 20;
  const EXIT_BUFFER_VH = 30;
  
  // Total scroll track height:
  // - 100vh for the sticky viewport
  // - Entry buffer for the section to settle
  // - (n-1) transitions × scroll per item
  // - Exit buffer to view the last item fully
  const scrollTrackHeight = 100 + ENTRY_BUFFER_VH + (numExperiences - 1) * SCROLL_PER_ITEM_VH + EXIT_BUFFER_VH;
  
  const { scrollYProgress: experienceScrollProgress } = useScroll({
    target: experienceContainerRef,
    // "start start" = progress 0 when container top hits viewport top (sticky begins)
    // "end end" = progress 1 when container bottom hits viewport bottom (sticky ends)
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const unsubscribe = experienceScrollProgress.on("change", (latest) => {
      // Calculate the effective scroll distance (total height minus viewport)
      const totalScrollDistance = scrollTrackHeight - 100; // in vh
      
      // Convert progress to "vh scrolled"
      const scrolledVh = latest * totalScrollDistance;
      
      // Subtract entry buffer, then divide by scroll per item
      const adjustedScroll = scrolledVh - ENTRY_BUFFER_VH;
      
      // Map to index: clamp between 0 and last index
      const rawIndex = adjustedScroll / SCROLL_PER_ITEM_VH;
      const index = Math.max(0, Math.min(Math.floor(rawIndex), numExperiences - 1));
      
      setActiveJobIndex(index);
    });
    return () => unsubscribe();
  }, [experienceScrollProgress, numExperiences, scrollTrackHeight]);

  return (
    <div className="min-h-screen relative">
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="font-display font-bold text-xl tracking-tight">SF.</div>
        <div className="flex gap-6 text-sm font-medium">
          <a href="#work" className="hover:opacity-70 transition-opacity">Work</a>
          <a href="#projects" className="hover:opacity-70 transition-opacity">Projects</a>
          <a href="#about" className="hover:opacity-70 transition-opacity">Technical Arsenal</a>
          <button onClick={() => setIsContactOpen(true)} className="hover:opacity-70 transition-opacity">Contact</button>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto relative">
          {/* Background Scene - Only visible in Hero */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <Scene />
          </div>

          <motion.div 
            style={{ opacity, scale }}
            className="space-y-8 relative z-10"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-text-primary leading-[0.9] tracking-tighter">
                Samuel<br />Fitoussi
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col md:flex-row gap-8 md:items-center"
            >
              <div className="h-px w-12 bg-primary md:w-24" />
              <p className="text-xl md:text-2xl text-text-secondary font-light max-w-2xl leading-relaxed">
                {resumeData.personal.bio}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4 pt-8"
            >
              <button 
                onClick={() => setIsContactOpen(true)}
                className="group flex items-center gap-2 px-6 py-3 bg-text-primary text-white rounded-full hover:bg-primary transition-colors"
              >
                Get in touch 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href={resumeData.personal.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-colors bg-white/50 backdrop-blur-sm">
                <Linkedin size={20} />
              </a>
              <a href={`mailto:${resumeData.personal.email}`} className="p-3 rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-colors bg-white/50 backdrop-blur-sm">
                <Mail size={20} />
              </a>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-10 left-6 md:left-20 text-sm font-mono text-text-muted animate-bounce z-10">
            SCROLL TO EXPLORE
          </div>
        </section>

        {/* Work Section - Hybrid 3D/2D */}
        {/* Added 'relative' for proper Framer Motion scroll offset calculation */}
        <section id="work" className="relative px-6 md:px-20 max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-t-3xl shadow-2xl z-20 -mt-10 pb-20">
          <div className="pt-20 flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary">Selected Work</h2>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
              {['experience', 'education'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === tab 
                      ? 'bg-white shadow-sm text-text-primary' 
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'experience' ? (
            // Scroll-driven Experience Container
            // Height creates the scroll track for sticky behavior
            <div 
              ref={experienceContainerRef} 
              className="relative" 
              style={{ height: `${scrollTrackHeight}vh` }}
            >
              {/* Sticky container: sticks when parent enters viewport */}
              {/* Fixed height grid with explicit row sizing to prevent resize glitches */}
              <div className="sticky top-24 h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-12 grid-rows-1 gap-8">
                
                {/* 3D Blockchain Visualization - Fixed dimensions, no content-based sizing */}
                <div className="lg:col-span-5 row-span-1 h-full bg-slate-50/50 rounded-3xl border border-slate-200 overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-10 text-xs font-mono text-slate-400">CAREER LEDGER</div>
                  <BlockchainExperience 
                    activeIndex={activeJobIndex} 
                    onIndexChange={setActiveJobIndex}
                  />
                  
                  {/* Scroll Progress Indicator - Now clickable */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {resumeData.experience.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveJobIndex(i)}
                        className={`h-2 rounded-full transition-all duration-300 hover:scale-110 ${
                          i === activeJobIndex 
                            ? 'bg-primary w-6' 
                            : i < activeJobIndex 
                              ? 'bg-primary/40 w-2 hover:bg-primary/60' 
                              : 'bg-slate-300 w-2 hover:bg-slate-400'
                        }`}
                        aria-label={`Go to experience ${i + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Scroll hint */}
                  <div className="absolute bottom-6 right-6 text-xs font-mono text-slate-400 animate-pulse">
                    {activeJobIndex < numExperiences - 1 ? '↓ SCROLL' : '✓ DONE'}
                  </div>
                </div>

                {/* Detail Card */}
                <div className="lg:col-span-7 row-span-1 h-full relative">
                  {/* Vertical progress bar on the left edge */}
                  <div className="absolute left-0 top-8 bottom-8 w-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="w-full bg-gradient-to-b from-primary to-secondary rounded-full"
                      style={{ 
                        height: `${((activeJobIndex + 1) / numExperiences) * 100}%`,
                        transition: 'height 0.3s ease-out'
                      }}
                    />
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeJobIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full p-8 md:p-12 pl-10 rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 flex flex-col ml-2"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="font-mono text-xs text-primary px-2 py-1 bg-primary/5 rounded-full uppercase tracking-wider mb-2 inline-block">
                            {resumeData.experience[activeJobIndex].date}
                          </span>
                          <h3 className="font-display text-3xl font-bold text-slate-900">
                            {resumeData.experience[activeJobIndex].company}
                          </h3>
                          <div className="text-xl text-slate-500 font-medium mt-1">
                            {resumeData.experience[activeJobIndex].role}
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors cursor-help">
                            <MapPin size={20} />
                            <span className="text-sm font-medium">{resumeData.experience[activeJobIndex].location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-grow overflow-y-auto custom-scrollbar pr-4">
                        <ul className="space-y-4">
                          {resumeData.experience[activeJobIndex].description.map((item, i) => (
                            <li key={i} className="text-slate-600 leading-relaxed flex items-start gap-3">
                              <ChevronRight size={16} className="mt-1 text-primary shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="flex flex-wrap gap-2">
                          {resumeData.experience[activeJobIndex].technologies?.map(tech => (
                            <span key={tech} className="px-3 py-1 bg-slate-50 text-slate-600 text-sm font-medium rounded-lg border border-slate-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {resumeData.education.map((edu) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-3xl border border-slate-100 bg-white/90 backdrop-blur-md hover:shadow-lg transition-all"
                >
                  <div className="font-mono text-xs text-secondary mb-2">{edu.date}</div>
                  <h3 className="font-display text-2xl font-bold mb-2">{edu.institution}</h3>
                  <div className="text-primary font-medium mb-4">{edu.degree}</div>
                  <ul className="space-y-2">
                    {edu.details.map((detail, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-primary">›</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Projects / Chess Section */}
        <section id="projects" className="py-20 px-6 md:px-20 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold mb-4">Strategic Moves</h2>
              <p className="text-slate-500">Capture a piece to reveal a project.</p>
            </div>
            <ChessGallery />
          </div>
        </section>

        {/* Skills Section - Neural Network */}
        <section id="about" className="py-20 px-6 md:px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-4xl font-bold mb-6">Technical Arsenal</h2>
                <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                  My stack is built on a foundation of rigorous engineering principles, adapted for the speed of modern product development. I specialize in backend systems that handle high-value financial data.
                </p>
                
                <div className="space-y-8">
                  {resumeData.skills.map((category) => (
                    <div key={category.category}>
                      <h3 className="font-mono text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">
                        {category.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {category.items.map((skill) => (
                          <span key={skill} className="px-3 py-1.5 border border-slate-200 text-text-secondary text-sm rounded-lg hover:border-primary hover:text-primary transition-colors cursor-default bg-white">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-[600px] w-full">
                <div className="absolute top-4 right-4 z-10 text-xs font-mono text-slate-400">TECH CONSTELLATION</div>
                <NeuralSkills />
              </div>
            </div>
          </div>
        </section>

        {/* Footer / Contact */}
        <footer id="contact" className="py-20 px-6 md:px-20 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h2 className="font-display text-3xl font-bold mb-2">Let's Build Together</h2>
              <p className="text-text-secondary">Open for new opportunities in Product & Data Engineering.</p>
            </div>
            
            <div className="flex gap-6">
              <a href={`mailto:${resumeData.personal.email}`} className="text-text-secondary hover:text-primary transition-colors font-medium">
                Email
              </a>
              <a href={resumeData.personal.linkedin} className="text-text-secondary hover:text-primary transition-colors font-medium">
                LinkedIn
              </a>
            </div>
          </div>
          <div className="mt-12 text-center text-xs text-text-muted font-mono">
            © {new Date().getFullYear()} Samuel Fitoussi.
          </div>
        </footer>

      </main>
    </div>
  );
}

export default App;
