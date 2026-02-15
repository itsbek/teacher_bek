import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

const customStyles = {
  body: {
    fontFamily: "'Manrope', sans-serif",
    backgroundColor: '#f4f4f0',
    color: '#1a1a1a',
    cursor: 'none',
    overflowX: 'hidden'
  },
  fontDisplay: {
    fontFamily: "'Playfair Display', serif"
  },
  cursor: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '20px',
    height: '20px',
    border: '1px solid #000',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 9999,
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.3s, height 0.3s, background-color 0.3s',
    mixBlendMode: 'difference',
    backgroundColor: 'transparent'
  },
  cursorHovered: {
    width: '50px',
    height: '50px',
    backgroundColor: '#fff',
    borderColor: 'transparent',
    mixBlendMode: 'difference'
  },
  timelineLine: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '1px',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)'
  }
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    document.addEventListener('mousemove', handleMouseMove);
    
    const interactiveElements = document.querySelectorAll('a, button, .link-cursor');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div
      style={{
        ...customStyles.cursor,
        left: `${position.x}px`,
        top: `${position.y}px`,
        ...(isHovered ? customStyles.cursorHovered : {})
      }}
    />
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
      <Link to="/" className="text-xl font-bold tracking-tighter uppercase link-cursor">
        Elena Vance®
      </Link>
      
      <div className="hidden md:flex items-center space-x-12">
        <a href="/#philosophy" className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors link-cursor">
          Philosophy
        </a>
        <a href="/#curriculum" className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors link-cursor">
          Curriculum
        </a>
        <a href="/#journal" className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors link-cursor">
          Journal
        </a>
        <a href="/#contact" className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors link-cursor">
          Contact
        </a>
      </div>

      <button className="md:hidden link-cursor" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#f4f4f0] pt-20 pb-12 px-4 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end border-t border-black/10 pt-12">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[10vw] leading-none font-bold tracking-tighter opacity-5 select-none pointer-events-none text-black">
              VANCE
            </h1>
          </div>
          <div className="flex gap-8 text-xs text-gray-500 uppercase tracking-widest">
            <span>© 2024 Elena Vance</span>
            <a href="#" className="hover:text-black transition-colors link-cursor">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black transition-colors link-cursor">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FadeUpSection = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

const AboutPage = () => {
  return (
    <div style={customStyles.body} className="antialiased selection:bg-black selection:text-white">
      <Header />

      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover grayscale"
            alt="Elena Vance Hero"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <FadeUpSection delay={0}>
            <span className="text-xs font-bold uppercase tracking-[0.3em] mb-6 block">
              Architect of Inquiry
            </span>
          </FadeUpSection>
          <FadeUpSection delay={0.1}>
            <h1 style={customStyles.fontDisplay} className="text-7xl md:text-9xl leading-[0.85] tracking-tighter mb-8">
              Shaping the <br />
              <span className="italic">Minds of Tomorrow</span>
            </h1>
          </FadeUpSection>
          <FadeUpSection delay={0.2}>
            <p className="text-lg md:text-xl font-light max-w-2xl mx-auto opacity-80">
              A narrative of fifteen years dedicated to the intersection of pedagogical rigor and creative intellectual freedom.
            </p>
          </FadeUpSection>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
      </section>

      <section className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <FadeUpSection className="lg:col-span-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-12 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-black"></span> The Core Philosophy
            </h2>
            <p style={customStyles.fontDisplay} className="text-4xl md:text-5xl leading-tight tracking-tight mb-8">
              Education is not the filling of a vessel, but the <span className="italic">kindling of a flame.</span>
            </p>
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>My approach is rooted in the belief that every student possesses a unique intellectual fingerprint. My role is to provide the framework—the scaffolding—within which that intellect can build something meaningful.</p>
              <p>I reject the industrial model of education. Instead, I advocate for a personalized, inquiry-based system where curiosity is the primary driver of achievement.</p>
            </div>
          </FadeUpSection>
          <FadeUpSection delay={0.2} className="lg:col-span-6 lg:col-start-7 grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Library"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden pt-12 grayscale hover:grayscale-0 transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Classroom"
              />
            </div>
          </FadeUpSection>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-20 text-center">
            Milestones & Expertise
          </h2>
          
          <div className="relative">
            <div className="hidden md:block" style={customStyles.timelineLine}></div>
            
            <div className="space-y-24">
              <FadeUpSection>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:pr-16">
                    <span className="font-mono text-sm text-gray-400">2018 — PRESENT</span>
                    <h3 style={customStyles.fontDisplay} className="text-2xl mt-2">
                      Independent Educational Strategist
                    </h3>
                    <p className="mt-4 text-gray-600 max-w-md md:ml-auto">
                      Developing bespoke academic roadmaps for high-potential students globally, focusing on narrative-driven college applications.
                    </p>
                  </div>
                  <div className="md:pl-16 relative">
                    <div className="hidden md:block absolute left-[-4.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black"></div>
                    <img
                      src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
                      className="w-64 h-40 object-cover grayscale"
                      alt="Experience 1"
                    />
                  </div>
                </div>
              </FadeUpSection>

              <FadeUpSection>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:order-2 md:pl-16">
                    <span className="font-mono text-sm text-gray-400">2012 — 2018</span>
                    <h3 style={customStyles.fontDisplay} className="text-2xl mt-2">
                      Director of Pedagogy, St. Jude's Academy
                    </h3>
                    <p className="mt-4 text-gray-600 max-w-md">
                      Led the redesign of the humanities curriculum, implementing a cross-disciplinary Socratic seminar model across grades 9-12.
                    </p>
                  </div>
                  <div className="md:order-1 md:text-right md:pr-16 relative">
                    <div className="hidden md:block absolute right-[-4.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black"></div>
                    <img
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
                      className="w-64 h-40 object-cover grayscale ml-auto"
                      alt="Experience 2"
                    />
                  </div>
                </div>
              </FadeUpSection>

              <FadeUpSection>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right md:pr-16">
                    <span className="font-mono text-sm text-gray-400">2008 — 2012</span>
                    <h3 style={customStyles.fontDisplay} className="text-2xl mt-2">
                      Doctoral Research, Oxford University
                    </h3>
                    <p className="mt-4 text-gray-600 max-w-md md:ml-auto">
                      Ph.D. in Educational Philosophy. Published thesis on "The Cognitive Resilience of Inquiry-Based Learning in Early Adolescence."
                    </p>
                  </div>
                  <div className="md:pl-16 relative">
                    <div className="hidden md:block absolute left-[-4.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black"></div>
                    <img
                      src="https://images.unsplash.com/photo-1523050335392-93851179ae22?q=80&w=800&auto=format&fit=crop"
                      className="w-64 h-40 object-cover grayscale"
                      alt="Experience 3"
                    />
                  </div>
                </div>
              </FadeUpSection>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto border-t border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FadeUpSection>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">The Methodology</h4>
            <h5 style={customStyles.fontDisplay} className="text-2xl mb-4">
              Structural Freedom
            </h5>
            <p className="text-gray-600">
              We define rigid goals but provide fluid paths. This allows for spontaneous discovery while maintaining academic accountability.
            </p>
          </FadeUpSection>
          <FadeUpSection delay={0.1}>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">The Vision</h4>
            <h5 style={customStyles.fontDisplay} className="text-2xl mb-4">
              Beyond Metrics
            </h5>
            <p className="text-gray-600">
              Success is not just a GPA. It is the ability to articulate a complex thought, to challenge an authority respectfully, and to think critically.
            </p>
          </FadeUpSection>
          <FadeUpSection delay={0.2}>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">The Outcome</h4>
            <h5 style={customStyles.fontDisplay} className="text-2xl mb-4">
              Intellectual Agency
            </h5>
            <p className="text-gray-600">
              My students don't just get into top universities; they arrive there prepared to lead conversations and redefine their fields.
            </p>
          </FadeUpSection>
        </div>
      </section>

      <section className="py-32 bg-black text-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <FadeUpSection>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-8 text-gray-400">
              Achievements & Recognition
            </h2>
            <ul className="space-y-8">
              <li className="border-b border-white/20 pb-6">
                <span className="text-sm font-mono text-gray-500">2022</span>
                <h4 className="text-xl mt-1">Global Educator of the Year Award</h4>
              </li>
              <li className="border-b border-white/20 pb-6">
                <span className="text-sm font-mono text-gray-500">2020</span>
                <h4 className="text-xl mt-1">Keynote Speaker at World Education Summit</h4>
              </li>
              <li className="border-b border-white/20 pb-6">
                <span className="text-sm font-mono text-gray-500">2019</span>
                <h4 className="text-xl mt-1">Author of "The Inquiry Framework"</h4>
              </li>
              <li className="pb-6">
                <span className="text-sm font-mono text-gray-500">2015</span>
                <h4 className="text-xl mt-1">Fellowship at the Royal Society of Arts</h4>
              </li>
            </ul>
          </FadeUpSection>
          <FadeUpSection delay={0.2} className="aspect-square grayscale opacity-70">
            <img
              src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1000&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="Elena Professional"
            />
          </FadeUpSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
      
      body {
        font-family: 'Manrope', sans-serif;
        background-color: #f4f4f0;
        color: #1a1a1a;
        cursor: none;
        overflow-x: hidden;
      }
      
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <Router basename="/">
      <CustomCursor />
      <Routes>
        <Route path="/" element={<AboutPage />} />
      </Routes>
    </Router>
  );
};

export default App;