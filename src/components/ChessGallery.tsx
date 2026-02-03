import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

interface Project {
  id: string;
  targetSquare: number; // Index 0-63
  title: string;
  description: string;
  tech: string[];
  color: string;
}

const projects: Project[] = [
  {
    id: 'battery',
    targetSquare: 27, // d5
    title: 'EV Battery Passport',
    description: 'Master\'s Thesis: Engineered an on-chain Digital Product Passport (DPP) system for EV battery lifecycle management using Bitcoin SV. Reduced per-DPP cost to $0.001.',
    tech: ['Bitcoin SV', 'Cryptography', 'Python'],
    color: 'bg-emerald-500'
  },
  {
    id: 'ico',
    targetSquare: 18, // c6
    title: 'ICO Success Predictor',
    description: 'Applied neural networks and sentiment analysis to predict Initial Coin Offering (ICO) success rates based on whitepaper text and market sentiment.',
    tech: ['Python', 'TensorFlow', 'NLP'],
    color: 'bg-blue-500'
  },
  {
    id: 'music',
    targetSquare: 45, // f3
    title: 'Remuscent',
    description: 'Created a decentralized music production platform allowing artists to collaborate and share royalties transparently via smart contracts.',
    tech: ['Solidity', 'React', 'Web3.js'],
    color: 'bg-purple-500'
  },
  {
    id: 'trading',
    targetSquare: 42, // c3
    title: 'Algo Trading Bot',
    description: 'Developed predictive models and algorithmic trading strategies for crypto markets, focusing on arbitrage and mean reversion.',
    tech: ['Python', 'Pandas', 'Binance API'],
    color: 'bg-orange-500'
  }
];

export default function ChessGallery() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [queenPos, setQueenPos] = useState(36); // Start at e4
  const [capturedSquares, setCapturedSquares] = useState<number[]>([]);
  
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.5 });

  // Reset game when scrolled out of view
  if (!isInView && (activeProject !== null || capturedSquares.length > 0)) {
    setActiveProject(null);
    setQueenPos(36);
    setCapturedSquares([]);
  }

  const handleSquareClick = (index: number) => {
    const project = projects.find(p => p.targetSquare === index);
    
    if (project) {
      setQueenPos(index);
      if (!capturedSquares.includes(index)) {
        setCapturedSquares([...capturedSquares, index]);
      }
      setActiveProject(project);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row gap-12 items-center justify-center min-h-[500px]">
      {/* Chess Board */}
      <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] bg-[#f0d9b5] rounded-lg shadow-2xl border-8 border-[#b58863] grid grid-cols-8 grid-rows-8">
        {Array.from({ length: 64 }).map((_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const isBlack = (row + col) % 2 === 1;
          
          const project = projects.find(p => p.targetSquare === i);
          const isQueenHere = queenPos === i;
          const isCaptured = capturedSquares.includes(i);
          const isActive = project && activeProject?.id === project.id;

          return (
            <div 
              key={i} 
              className={`
                relative flex items-center justify-center text-3xl select-none
                ${isBlack ? 'bg-[#b58863]' : 'bg-[#f0d9b5]'}
                ${project ? 'cursor-pointer hover:bg-opacity-80 transition-colors' : ''}
                ${isActive ? 'ring-inset ring-4 ring-blue-400/50' : ''}
              `}
              onClick={() => project && handleSquareClick(i)}
            >
              {/* Target Marker (Black Piece) */}
              {project && !isCaptured && !isQueenHere && (
                <span className="text-black transform hover:scale-110 transition-transform">♟</span>
              )}

              {/* The Queen */}
              {isQueenHere && (
                <motion.span 
                  layoutId="queen"
                  className="text-white drop-shadow-md text-4xl z-10"
                >
                  ♛
                </motion.span>
              )}
              
              {/* Captured Marker */}
              {isCaptured && !isQueenHere && (
                <div className={`w-3 h-3 rounded-full ${project?.color} opacity-50`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Project Card */}
      <div className="w-full max-w-md h-[300px] relative perspective-1000">
        <AnimatePresence mode="wait">
          {activeProject ? (
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, rotateY: -10, x: 20 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: 10, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 h-full flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${activeProject.color}`}>
                  Captured
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-800">{activeProject.title}</h3>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                {activeProject.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {activeProject.tech.map(t => (
                  <span key={t} className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 font-mono text-sm border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50">
              <span className="text-4xl mb-4 text-slate-300">♛</span>
              <p>Move the Queen to capture black pawns and reveal projects</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
