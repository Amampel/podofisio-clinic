import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ChevronDown, ArrowDown, Activity, Footprints } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import backgroundVideo from '../assets/videos/5794352_Coll_wavebreak_Physio_1920x1080.mp4';
const ScrollSection = ({ children, progressRange, opacityRange, scaleRange, yRange }: any) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, progressRange, opacityRange);
  const scale = useTransform(scrollYProgress, progressRange, scaleRange);
  const y = useTransform(scrollYProgress, progressRange, yRange);

  return (
    <motion.div style={{ opacity, scale, y }} className="w-full">
      {children}
    </motion.div>
  );
};

export default function App() {
  const containerRef = useRef(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Intersection observer for Video
  const { ref: videoRef, inView: videoInView } = useInView({
    threshold: 0.2, // trigger when 20% visible
  });

  // Effect to play/pause video based on visibility without losing time
  useEffect(() => {
    if (playerRef.current) {
      if (videoInView) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [videoInView]);

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    // Autoplay requires mute initially to work without user interaction in most browsers, 
    // but we leave it as normal as the playVideo will be triggered by scroll.
    if (videoInView) {
      event.target.playVideo();
    }
  };

  // Smooth scroll progress for some effects
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // YouTube Video ID
  const videoId = "6v2L2UGZJAM";

  // Background effects tied to scroll
  const videoScale = useTransform(smoothProgress, [0, 0.2, 0.5, 1], [1, 1.2, 1.5, 2]);
  const videoBlur = useTransform(smoothProgress, [0, 0.1, 0.3], ["blur(0px)", "blur(4px)", "blur(10px)"]);
  const videoOpacity = useTransform(smoothProgress, [0, 0.5, 0.8, 1], [0.7, 0.35, 0.1, 0]);

  // Spotlight / Lighting tied to scroll
  const spotlightScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.5, 0.8]);
  const spotlightOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.3, 0.8, 0.8, 0.4]);

  return (
    <div ref={containerRef} className="relative bg-black text-white selection:bg-white selection:text-black font-sans">

      {/* Fixed Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ scale: videoScale, filter: videoBlur, opacity: videoOpacity }}
          className="w-full h-full"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center grayscale brightness-60"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        </motion.div>
      </div>

      {/* Dynamic Lighting Overlay */}
      <motion.div
        style={{ opacity: spotlightOpacity, scale: spotlightScale }}
        className="fixed inset-0 z-50 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.9)_85%)]" />
      </motion.div>

      {/* Main Content Sections */}
      <div className="relative z-20">

        {/* Hero Section */}
        <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
          <ScrollSection
            progressRange={[0, 0.1]}
            opacityRange={[1, 0]}
            scaleRange={[1, 0.95]}
            yRange={[0, -30]}
          >
            <h1 className="serif text-4xl md:text-8xl font-light leading-tight tracking-tight mb-6 text-white">
              Cada proyecto tiene una <br />
              <span className="italic">historia</span>.
            </h1>
            <h2 className="serif text-2xl md:text-6xl font-light italic text-white/90">
              Y este ya tiene vida.
            </h2>
          </ScrollSection>

          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 text-white/30"
          >
            <ChevronDown size={32} strokeWidth={1} />
          </motion.div>
        </section>

        {/* Video Section */}
        <section className="-mt-24 md:-mt-32 py-2 md:py-8 flex flex-col items-center justify-center px-4 md:px-24 relative z-30">
          <ScrollSection
            progressRange={[0.05, 0.15, 0.25]}
            opacityRange={[0, 1, 0]}
            scaleRange={[0.9, 1, 0.95]}
            yRange={[50, 0, -50]}
          >
            <div ref={videoRef} className="w-full max-w-5xl mx-auto p-1 md:p-2 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-b from-white/20 to-transparent shadow-[0_0_50px_rgba(255,255,255,0.1)] backdrop-blur-sm">
              <div className="w-full rounded-[1.8rem] md:rounded-[2.8rem] overflow-hidden relative aspect-video bg-black">
                <YouTube
                  videoId="ECnIN5BK-g8"
                  onReady={onReady}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 1, // We let the script handle play/pause by view
                      controls: 1,
                      rel: 0,
                      modestbranding: 1,
                      loop: 1,
                      playlist: 'ECnIN5BK-g8'
                    },
                  }}
                  className="absolute top-0 left-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                />
              </div>
            </div>
          </ScrollSection>
        </section>

        {/* Narrative Section 1 */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 md:px-24">
          <ScrollSection
            progressRange={[0.15, 0.25, 0.35]}
            opacityRange={[0, 1, 0]}
            scaleRange={[0.9, 1, 0.95]}
            yRange={[50, 0, -50]}
          >
            <div className="max-w-4xl mx-auto text-center md:text-left">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-bold text-white/60 mb-16">
                Nos queda poco. Muy poco.
              </p>
              <p className="text-2xl md:text-5xl font-light leading-snug text-white serif italic mb-20">
                Pero se hace duro ver personas con muletas, cojeando, personas que nos paran y nos preguntan:
              </p>
            </div>
          </ScrollSection>
        </section>

        {/* Section 2: The Question */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-6">
          <ScrollSection
            progressRange={[0.3, 0.4, 0.5]}
            opacityRange={[0, 1, 0]}
            scaleRange={[0.7, 1, 1.3]}
            yRange={[50, 0, -50]}
          >
            <div className="relative py-10 text-center">
              <div className="w-24 h-px bg-white/40 mx-auto mb-10" />
              <h3 className="serif text-5xl md:text-9xl italic text-white py-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                “¿Cuándo abrís?”
              </h3>
              <div className="w-24 h-px bg-white/40 mx-auto mt-10" />
            </div>
          </ScrollSection>
        </section>

        {/* Section 3: The Clue */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-24">
          <ScrollSection
            progressRange={[0.45, 0.55, 0.65]}
            opacityRange={[0, 1, 0]}
            scaleRange={[0.95, 1, 0.95]}
            yRange={[50, 0, -50]}
          >
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <p className="text-2xl md:text-5xl font-light leading-relaxed text-white serif mb-8">
                Y no poder dar una fecha exacta.
              </p>
              <h3 className="serif text-3xl md:text-6xl font-light mb-6">Solo dejar una pista.</h3>
              <p className="text-xl md:text-4xl font-light leading-relaxed text-white/70 italic serif">
                Unas huellas marcadas que atraviesan la obra y conducen hasta aquí.
              </p>
            </div>
          </ScrollSection>
        </section>

        {/* Local Connecting Line (Between Section 3 and 4) */}
        <section className="h-60 flex justify-center relative">
          <div className="absolute inset-0 flex justify-center">
            <div className="w-px h-full bg-white/5" />
          </div>
          <motion.div
            style={{
              height: useTransform(smoothProgress, [0.55, 0.7], ["0%", "100%"]),
              opacity: useTransform(smoothProgress, [0.55, 0.7], [0, 1]),
            }}
            className="w-[2px] bg-gradient-to-b from-transparent via-white to-white shadow-[0_0_20px_white] relative z-10"
          >
            {/* Arrow at the bottom of the local line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-1">
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[10px] border-t-white shadow-[0_0_15px_white]" />
            </div>
          </motion.div>
        </section>

        {/* Section 4: Conditions */}
        <section className="min-h-screen py-20 px-6 md:px-24 flex flex-col items-center justify-center">
          <ScrollSection
            progressRange={[0.65, 0.8, 0.9]}
            opacityRange={[0, 1, 0]}
            scaleRange={[0.98, 1, 0.98]}
            yRange={[50, 0, -50]}
          >
            <div className="max-w-3xl mx-auto text-center space-y-10">
              <h4 className="text-xs uppercase tracking-[0.6em] text-white/60 mb-8 font-bold">Condiciones Especiales de Preapertura</h4>

              <div className="space-y-6 text-lg md:text-2xl font-light text-white serif">
                <p>Estamos ultimando la clínica para abrir a mediados-finales de abril.</p>
                <p>Hemos decidido abrir la agenda antes de abrir la puerta.</p>
              </div>

              {/* Pricing Table - Simple & Clean */}
              <div className="max-w-md mx-auto border border-white/20 rounded-2xl p-8 bg-white/5 backdrop-blur-xl space-y-6 shadow-2xl">
                {[
                  { name: "Podología", price: "30€" },
                  { name: "Fisioterapia", price: "50€" },
                  { name: "Estudio + Plantillas", price: "180€" },
                  { name: "Pack revisión completa", price: "220€", description: "(incluye podología, fisioterapia y estudio biomecánico/plantillas)" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0">
                    <div className="flex flex-col pr-4 text-left">
                      <span className="text-sm md:text-base text-white/80">{item.name}</span>
                      {item.description && (
                        <span className="text-xs text-white/50 mt-1">
                          {item.description}
                        </span>
                      )}
                    </div>
                    <span className="text-xl md:text-2xl font-bold text-white whitespace-nowrap">{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 space-y-4 text-sm md:text-base text-white/60 italic serif">
                <p>Disponible únicamente hasta el día de apertura.</p>
                <p>Si has llegado hasta aquí, probablemente no sea casualidad.</p>
              </div>

              <motion.div
                animate={{ y: [0, 12, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-white flex justify-center pt-6"
              >
                <ArrowDown size={40} strokeWidth={1} />
              </motion.div>
            </div>
          </ScrollSection>
        </section>

        {/* Final CTA Section */}
        <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
          <ScrollSection
            progressRange={[0.85, 1]}
            opacityRange={[0, 1]}
            scaleRange={[0.8, 1]}
            yRange={[100, 0]}
          >
            <div className="relative z-10 w-full max-w-lg mx-auto">
              <motion.button
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const phoneNumber = "34624578754";
                  const message = "Hola! He visto vuestro vídeo de la clínica y me gustaría reservar una cita para la apertura y aprovechar la promoción. ¿Tenéis alguna hora disponible?";
                  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="group relative w-full py-10 bg-transparent border border-white/20 overflow-hidden transition-all duration-500"
              >
                {/* Futuristic Corner Brackets */}
                <motion.div
                  variants={{ hover: { opacity: 1, x: -5, y: -5 } }}
                  className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white opacity-0 transition-all duration-300"
                />
                <motion.div
                  variants={{ hover: { opacity: 1, x: 5, y: -5 } }}
                  className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white opacity-0 transition-all duration-300"
                />
                <motion.div
                  variants={{ hover: { opacity: 1, x: -5, y: 5 } }}
                  className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white opacity-0 transition-all duration-300"
                />
                <motion.div
                  variants={{ hover: { opacity: 1, x: 5, y: 5 } }}
                  className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white opacity-0 transition-all duration-300"
                />

                {/* Background Liquid Fill */}
                <motion.div
                  variants={{ hover: { y: 0 } }}
                  initial={{ y: "100%" }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 bg-white z-0"
                />

                {/* Scanning Line Effect */}
                <motion.div
                  variants={{ hover: { x: "200%" } }}
                  initial={{ x: "-100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-10 pointer-events-none"
                />

                {/* Text Content */}
                <div className="relative z-20 flex items-center justify-center">
                  <motion.span
                    variants={{ hover: { color: "#000", letterSpacing: "0.4em" } }}
                    className="text-xl md:text-3xl font-bold text-white tracking-[0.2em] transition-all duration-500"
                  >
                    Reserva tu plaza
                  </motion.span>
                </div>

                {/* Outer Glow Pulse */}
                <motion.div
                  variants={{ hover: { opacity: 1, scale: 1.05 } }}
                  className="absolute inset-0 border border-white/50 opacity-0 blur-md transition-all duration-500 pointer-events-none"
                />
              </motion.button>

              <p className="mt-12 text-[10px] md:text-xs uppercase tracking-[0.8em] text-white/30 font-bold">
                Plazas limitadas para la primera semana
              </p>
            </div>
          </ScrollSection>
        </section>

      </div>

      {/* Footer */}
      <footer className="relative z-20 py-16 px-6 text-center border-t border-white/5 bg-black">
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/40">
            © {new Date().getFullYear()} Podofisio Clinic - Terrassa
          </p>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20">
            Desarrollado por <a href="https://kivomarketing.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-white/10 underline-offset-4">KivoMarketing</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
