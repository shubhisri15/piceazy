'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

// NOTE: This single-file React component assumes the following packages are installed:
// - react, react-dom
// - framer-motion
// - react-intersection-observer
// Tailwind CSS must be configured in the project.

// -----------------------------
// Utility: debounce
// -----------------------------
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// -----------------------------
// Custom Hook: useMousePosition (debounced, mobile-safe)
// -----------------------------
function useMousePosition({ enabled = true, debounceMs = 8 } = {}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const handler = debounce((e) => {
      setPos({ x: e.clientX, y: e.clientY });
    }, debounceMs);
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [enabled, debounceMs]);
  return pos;
}

// -----------------------------
// Custom Hook: useParallax
// -----------------------------
function useParallax(factor = 0.2) {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY * factor);
    const deb = debounce(handler, 8);
    window.addEventListener("scroll", deb);
    handler();
    return () => window.removeEventListener("scroll", deb);
  }, [factor]);
  return y;
}

// -----------------------------
// Custom Hook: useIntersectionObserver (wrapper around react-intersection-observer)
// -----------------------------
function useReveal(options = {}) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "-10% 0px" , ...options});
  return { ref, inView };
}

// -----------------------------
// Custom Cursor
// -----------------------------
const CustomCursor = React.memo(function CustomCursor({ disabled = false, hoverScale = 2, hover = false }) {
  const isTouch = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const enabled = !disabled && !isTouch;
  const { x, y } = useMousePosition({ enabled });
  const cursorRef = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const el = cursorRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x - 8}px, ${y - 8}px, 0) scale(${hover ? hoverScale : 1})`;
  }, [x, y, hover, enabled, hoverScale]);

  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed top-0 left-0 z-[9999]">
      <div
        ref={cursorRef}
        className={`w-5 h-5 rounded-full bg-blue-500/90 border border-white/20 shadow-lg transform transition-transform duration-150`}>
      </div>
    </div>
  );
});

// -----------------------------
// FeatureCard
// -----------------------------
function FeatureCard({ icon, title, description, delay = 0 }) {
  const { ref, inView } = useReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 w-full max-w-xs hover:scale-105 transform transition-transform">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center text-xl">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-white">{title}</h4>
          <p className="text-sm text-white/70 mt-1">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// -----------------------------
// Interactive Stats (Animated Counter)
// -----------------------------
function AnimatedCounter({ target = 1200, duration = 1500, suffix = "+" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return (
    <div className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-300">
      {val}{suffix}
    </div>
  );
}

// -----------------------------
// Pricing Card
// -----------------------------
function PricingCard({ plan = "Pro", price = "$29", features = [], featured = false, buttonText = "Get Started" }) {
  return (
    <div className={`relative p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 ${featured ? 'scale-105 shadow-2xl' : ''}`}>
      {featured && <div className="absolute -top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold">Popular</div>}
      <h3 className="text-xl font-bold text-white">{plan}</h3>
      <div className="mt-2 text-3xl font-extrabold text-white">{price}<span className="text-sm font-medium text-white/70">/mo</span></div>
      <ul className="mt-4 space-y-2 text-white/80">
        {features.map((f, i) => <li key={i}>• {f}</li>)}
      </ul>
      <button className="mt-6 w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform">
        {buttonText}
      </button>
    </div>
  );
}

// -----------------------------
// Hero Section
// -----------------------------
function HeroSection({ onExplore }) {
  const [hoverDemo, setHoverDemo] = useState(false);
  const parallax = useParallax(0.12);
  const { ref, inView } = useReveal();

  return (
    <section ref={ref} className="h-screen flex items-center justify-center relative overflow-hidden">
      <div style={{ transform: `translateY(-${parallax}px)` }} className="container mx-auto px-6 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-5xl md:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-300">
              The Future of Image Creation
            </motion.h1>
            <motion.p className="mt-6 text-white/80 max-w-xl text-lg" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
              Neural Background Removal • Quantum Upscaling • Style-fusion that feels like magic. Create, edit, and scale imagery with a single click.
            </motion.p>
            <div className="mt-8 flex gap-4 items-center">
              <button onMouseEnter={() => setHoverDemo(true)} onMouseLeave={() => setHoverDemo(false)} onClick={() => onExplore?.()} className="glass-button px-6 py-3 rounded-full font-semibold backdrop-blur-lg bg-white/10 border border-white/10 hover:scale-105 transition-transform text-white">
                Experience the Magic
              </button>
              <button className="px-4 py-3 rounded-full font-medium bg-white/6 text-white/80 hover:bg-white/8 transition">Docs</button>
            </div>
            <div className="mt-10 flex gap-6 items-center">
              <div className="flex flex-col">
                <span className="text-white/80 text-sm">Images Processed</span>
                <AnimatedCounter target={12400} duration={1600} suffix="+" />
              </div>
              <div className="flex flex-col">
                <span className="text-white/80 text-sm">Neural Models</span>
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">12</div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <motion.div whileHover={{ rotateX: 6, rotateY: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 80 }} className="perspective-1000 transform-style-preserve">
              <div className={`relative w-[360px] md:w-[520px] h-[420px] rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 transform ${hoverDemo ? 'rotate-y-2' : ''}`}>
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  {/* Demo layers: background, image, overlay controls */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-slate-900/40 to-black/30" />
                  <motion.div initial={{ scale: 0.98 }} animate={hoverDemo ? { scale: 1.02 } : { scale: 0.98 }} transition={{ duration: 0.6 }} className="absolute left-6 top-6 w-[300px] h-[200px] rounded-xl overflow-hidden border border-white/10">
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1200&q=80')] bg-center bg-cover" />
                  </motion.div>

                  <div className="absolute bottom-6 left-6 right-6 flex gap-3 items-center">
                    <button className="px-3 py-2 rounded-md backdrop-blur-md bg-white/8 text-white text-sm">Neural Remove</button>
                    <button className="px-3 py-2 rounded-md backdrop-blur-md bg-white/8 text-white text-sm">Upscale ×4</button>
                    <button className="px-3 py-2 rounded-md backdrop-blur-md bg-white/8 text-white text-sm">Style AI</button>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

// -----------------------------
// Main App
// -----------------------------
export default function Home() {
  const [cursorHover, setCursorHover] = useState(false);
  const [disableCursor, setDisableCursor] = useState(false);
  const parallax = useParallax(0.04);

  // disable cursor for touch devices
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    setDisableCursor(isTouch);
  }, []);

  const handleNav = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-x-hidden">

      {/* Custom cursor */}
      <CustomCursor disabled={disableCursor} hover={cursorHover} />

      {/* Hero */}
      <main>
        <HeroSection onExplore={() => handleNav('features')} />

        {/* Features */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6 lg:px-24">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Powered by next-gen AI</h2>
            <p className="mt-3 text-white/70 max-w-xl">Explore a suite of creative tools that feel like they were pulled from the year 2030 — but faster.</p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/></svg>} title="Neural Background Removal" description="Accurate subject extraction with one click" delay={0} />
              <FeatureCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" stroke="white" strokeWidth="1.5"/></svg>} title="Quantum Upscaling" description="Upscale images without the mush — retain crispness" delay={0.1} />
              <FeatureCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18" stroke="white" strokeWidth="1.5"/></svg>} title="Style Fusion" description="Blend multiple references into a single coherent style" delay={0.2} />
            </div>
          </div>
        </section>

        {/* Interactive Stats + Pricing */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Built for creators & teams</h3>
              <p className="mt-3 text-white/70">Scalable APIs, batch processing, and a design-first UI so your workflow stays fast.</p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
                  <div className="text-sm text-white/80">Throughput</div>
                  <AnimatedCounter target={3200} duration={1200} suffix=" p/h" />
                </div>
                <div className="p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
                  <div className="text-sm text-white/80">Avg. Latency</div>
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">120ms</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PricingCard plan="Starter" price="$9" features={["100 images/mo", "Basic models", "Community support"]} featured={false} />
              <PricingCard plan="Pro" price="$49" features={["5,000 images/mo", "Priority models", "SLA 99.9%"]} featured />
            </div>
          </div>
        </section>

        {/* Demo / Contact */}
        <section id="demo" className="py-20">
          <div className="container mx-auto px-6 lg:px-24 text-center">
            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Try it live</h3>
            <p className="mt-3 text-white/70">Upload an image, nuke the background, or upscale — instant preview powered by neural models.</p>

            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-2xl p-6 rounded-3xl backdrop-blur-lg bg-white/5 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <input type="file" className="col-span-2 p-3 rounded-lg bg-white/6 text-white/80" />
                  <button className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 font-semibold">Run Neural Magic</button>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-white/60">
        <div className="container mx-auto px-6">© {new Date().getFullYear()} AetherImage — Built with future tech</div>
      </footer>

    </div>
  );
}
