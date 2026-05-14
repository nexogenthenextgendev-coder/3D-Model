'use client';

import Spline from '@splinetool/react-spline';
import { Suspense, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Zap, ArrowUpRight, Cpu, Activity, Globe, Play } from 'lucide-react';
import gsap from 'gsap';

// --- TYPEWRITER COMPONENT (DARK NETWORK THEME) ---
function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2500);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 70 : 130);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  useEffect(() => {
    const timeout2 = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  return (
    <span className="relative inline-flex items-center">
      <span className="bg-gradient-to-r from-[#00C8FF] via-[#00E0A0] to-[#FFD700] bg-clip-text text-transparent italic">
        {words[index].substring(0, subIndex)}
      </span>
      <span className={`inline-block w-[3px] h-[0.85em] bg-[#00C8FF] ml-2 rounded-full transform -translate-y-[2px] ${blink ? 'opacity-100' : 'opacity-0'}`} />
    </span>
  );
}

// --- MAGNETIC COMPONENT ---
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (ref.current) {
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      x.set((clientX - centerX) * 0.45);
      y.set((clientY - centerY) * 0.45);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="flex items-center justify-center py-4 px-2"
    >
      {children}
    </motion.div>
  );
}

// --- 3D TILT GLASS CTA (DARK NETWORK ACCENTS) ---
function Glass3DCTA() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [25, -25]);
  const rotateY = useTransform(x, [-100, 100], [-25, 25]);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 25 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 25 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-50 inline-block cursor-pointer gs-reveal-item"
    >
      <motion.div
        style={{ rotateX: springX, rotateY: springY }}
        className="group relative px-10 py-5 rounded-2xl bg-[#00C8FF]/[0.03] border border-[#00C8FF]/20 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden mt-1.5"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00C8FF]/10 via-transparent to-[#FFD700]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#00E0A0] opacity-80 leading-none mb-1">Initialize</span>
            <span className="text-xl font-black uppercase italic tracking-widest text-[#E0E0E0] leading-none">Experience Core</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#00C8FF]/10 border border-[#00C8FF]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FFD700]/20 transition-all duration-700">
            <ArrowUpRight className="h-5 w-5 text-[#FFD700]" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const splineContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = () => {
      const viewer = document.querySelector('spline-viewer');
      if (viewer && viewer.shadowRoot) {
        const logo = viewer.shadowRoot.querySelector('#logo');
        if (logo) (logo as HTMLElement).style.display = 'none';
      }
      const watermarks = document.querySelectorAll('a[href*="spline.design"], #spline-logo, .spline-watermark');
      watermarks.forEach(el => (el as HTMLElement).style.display = 'none');
    };
    const interval = setInterval(cleanup, 100);
    return () => clearInterval(interval);
  }, []);

  // --- GSAP REVEAL ANIMATION ---
  useEffect(() => {
    if (isLoaded) {
      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 2.2 } });

      tl.from(navbarRef.current, { y: -100, opacity: 0, duration: 1.5, delay: 0.5 });
      tl.from(splineContainerRef.current, { x: 400, scale: 0.8, opacity: 0, duration: 2.5 }, "-=1.2");
      tl.from(".gs-reveal-item", { y: 80, opacity: 0, stagger: 0.15 }, "-=2.2");
      tl.from(".gs-footer-item", { y: 40, opacity: 0, stagger: 0.2 }, "-=1.8");
    }
  }, [isLoaded]);

  function onLoad(spline: any) {
    const allObjects = spline.getAllObjects();
    allObjects.forEach((obj: any) => {
      const name = obj.name.toLowerCase();
      if (name.includes('text') || name.includes('button') || name.includes('join') || name.includes('logo') || name.includes('ui') || name.includes('wave') || name.includes('floor')) {
        obj.visible = false;
      }
      if (name.includes('sphere') && obj.scale.x < 0.4) {
        obj.visible = false;
      }
    });
    setIsLoaded(true);
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#121212] text-[#E0E0E0] font-sans selection:bg-[#00C8FF]/30">
      <style jsx global>{`
        #spline-logo, .spline-watermark, a[href*="spline.design"] { display: none !important; }
        ::-webkit-scrollbar { display: none; }
        canvas { background: transparent !important; }
      `}</style>

      {/* --- DARK NETWORK BACKGROUND AMBIENCE (CYAN/GREEN) --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] h-[600px] w-[600px] rounded-full bg-[#00C8FF]/[0.05] blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-[#00E0A0]/[0.05] blur-[180px]" />
      </div>

      {/* --- SPLINE LAYER --- */}
      <div
        ref={splineContainerRef}
        className="absolute inset-0 z-10 translate-x-[12%] translate-y-[5%] scale-105 pointer-events-auto"
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
        <Suspense fallback={null}>
          <Spline scene="https://prod.spline.design/j9kZQLksdnr1Fuqx/scene.splinecode" onLoad={onLoad} />
        </Suspense>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-20 flex h-full w-full flex-col pointer-events-none max-w-[1600px] mx-auto">

        {/* Navbar (Cyan/Yellow Accents) */}
        <nav ref={navbarRef} className="flex w-full items-center justify-between px-10 py-5.5 pointer-events-auto" style={{ opacity: isLoaded ? 1 : 0 }}>
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="h-12 w-12 rounded-xl bg-[#00C8FF] text-black flex items-center justify-center font-black italic shadow-[0_0_20px_rgba(0,200,255,0.4)] group-hover:scale-110 transition-transform duration-700">A</div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase italic leading-none text-[#E0E0E0]">Antigravity</span>
              <span className="text-xs font-bold tracking-[0.4em] text-[#00E0A0] opacity-40 uppercase mt-1">Spatial Neural Core</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-14">
            {['Engine', 'Network', 'Ecosystem'].map((item, i) => (
              <a key={i} href="#" className="text-sm font-bold tracking-[0.3em] text-[#E0E0E0]/40 uppercase hover:text-[#00C8FF] transition-all relative group pointer-events-auto">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#00C8FF] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <Magnetic>
            <button className="h-12 px-10 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 backdrop-blur-3xl text-xs font-bold tracking-widest uppercase text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all pointer-events-auto shadow-[0_0_15px_rgba(255,215,0,0.1)]">
              Initialize
            </button>
          </Magnetic>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-1 items-center px-10 pb-16">
          <div className="w-full lg:w-[50%] space-y-6">
            <div className="inline-flex items-center gap-4 rounded-full border border-[#00C8FF]/20 bg-[#00C8FF]/[0.03] px-8 py-3 backdrop-blur-3xl pointer-events-auto shadow-xl gs-reveal-item" style={{ opacity: isLoaded ? 1 : 0 }}>
              <div className="h-2.5 w-2.5 rounded-full bg-[#00E0A0] shadow-[0_0_10px_rgba(0,224,160,0.8)] animate-pulse" />
              <span className="text-[13px] font-bold tracking-[0.3em] text-[#00C8FF] uppercase">Neural Protocol Active</span>
            </div>

            <div className="space-y-4 gs-reveal-item" style={{ opacity: isLoaded ? 1 : 0 }}>
              <h1 className="text-7xl font-black tracking-tighter xl:text-9xl leading-[0.95] italic min-h-[2em] flex flex-col">
                <span className="text-[#E0E0E0]">SPATIAL</span>
                <Typewriter words={['NEURAL.', 'FUTURE.', 'SYSTEM.', 'CORE.']} />
              </h1>
              <div className="h-[2px] w-24 bg-gradient-to-r from-[#00C8FF] to-[#00E0A0] mt-2 rounded-full shadow-[0_0_15px_rgba(0,200,255,0.3)]" />
            </div>

            <div className="pointer-events-auto pt-8 gs-reveal-item" style={{ opacity: isLoaded ? 1 : 0 }}>
              <Glass3DCTA />
            </div>
          </div>
        </div>

        {/* Footer Stats (Dark Network Accents) */}
        <div className="px-10 pb-16 flex justify-between items-end pointer-events-auto">
          <div className="flex gap-16">
            {[{ label: "Stability", value: "99.9%" }, { label: "Sync", value: "0.2ms" }].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2 min-w-[140px] gs-footer-item" style={{ opacity: isLoaded ? 1 : 0 }}>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00E0A0]/40">{stat.label}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1 w-6 rounded-full bg-[#00C8FF]/20" />
                  <span className="text-3xl font-black tracking-tighter bg-gradient-to-b from-[#E0E0E0] to-[#E0E0E0]/30 bg-clip-text text-transparent">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-end gap-3 gs-footer-item" style={{ opacity: isLoaded ? 1 : 0 }}>
            <div className="flex gap-6 items-center">
              <div className="h-2 w-2 rounded-full bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.5)] animate-ping" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#00C8FF]/40 uppercase tracking-widest">SECURE</span>
            </div>
            <span className="text-[9px] font-black tracking-[0.6em] text-[#E0E0E0]/10 uppercase italic">ANTIGRAVITY // 2026</span>
          </div>
        </div>
      </div>

      {/* --- PRELOADER --- */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#121212]">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 border-t-2 border-[#00C8FF] rounded-full animate-spin shadow-[0_0_20px_rgba(0,200,255,0.3)]" />
              <span className="mt-8 text-[11px] font-bold tracking-[1em] text-[#00C8FF]/40 uppercase animate-pulse">Syncing...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
