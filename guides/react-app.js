import React, { useState, useEffect, useRef } from 'react';

const customStyles = {
  root: {
    '--cursor-size': '20px'
  },
  body: {
    fontFamily: "'Manrope', sans-serif",
    backgroundColor: '#f4f4f0',
    color: '#1a1a1a',
    overflowX: 'hidden'
  }
};

const useCustomCursor = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return { cursorPosition, isHovered, setIsHovered };
};

const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
};

const CustomCursor = ({ position, isHovered }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: isHovered ? '50px' : '20px',
      height: isHovered ? '50px' : '20px',
      border: isHovered ? 'none' : '1px solid #000',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 9999,
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.3s, height 0.3s, background-color 0.3s',
      mixBlendMode: 'difference',
      backgroundColor: isHovered ? '#fff' : 'transparent',
      left: `${position.x}px`,
      top: `${position.y}px`
    }}
  />
);

const Navigation = ({ onHover }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
      <a
        href="#"
        className="text-xl font-bold tracking-tighter uppercase"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        Elena Vance®
      </a>
      
      <div className="hidden md:flex items-center space-x-12">
        {['Philosophy', 'Curriculum', 'Journal', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors"
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
          >
            {item}
          </a>
        ))}
      </div>

      <button
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  );
};

const Header = () => {
  return (
    <header className="relative min-h-screen w-full flex flex-col justify-center px-4 md:px-12 pt-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f0f0eb] -z-10 hidden lg:block"></div>
      
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col">
          <h1 className="font-display text-[12vw] leading-[0.85] tracking-tight mix-blend-difference text-[#1a1a1a] opacity-0 fade-up" style={{ transitionDelay: '0.1s', fontFamily: "'Playfair Display', serif" }}>
            The Art
          </h1>
          <div className="flex items-center gap-8 md:gap-16 opacity-0 fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="w-24 h-[1px] bg-black hidden md:block"></div>
            <h1 className="font-display text-[12vw] leading-[0.85] tracking-tight text-[#1a1a1a] italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              of Learning
            </h1>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-end mt-12 md:mt-4 opacity-0 fade-up" style={{ transitionDelay: '0.3s' }}>
            <div className="max-w-md mb-8 md:mb-0">
              <p className="text-lg md:text-xl font-light leading-relaxed text-gray-600">
                Educational strategy and mentorship for the next generation of thinkers. Bridging the gap between traditional academics and creative problem solving.
              </p>
            </div>
            <h1 className="font-display text-[12vw] leading-[0.85] tracking-tight text-[#1a1a1a] text-right ml-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
              Reimagined
            </h1>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-12 hidden md:flex items-center gap-4">
        <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
      </div>
      
      <div className="absolute top-1/4 right-[5%] w-[30vw] h-[40vw] opacity-0 fade-up z-[-1]" style={{ transitionDelay: '0.5s', clipPath: 'inset(0 0 0 0)', transition: 'clip-path 1s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.8s ease-out' }}>
        <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop" alt="Abstract Library" className="w-full h-full object-cover grayscale contrast-125 brightness-110" />
      </div>
    </header>
  );
};

const MarqueeSection = () => {
  return (
    <div className="w-full bg-black text-[#f4f4f0] py-6 overflow-hidden">
      <div className="whitespace-nowrap">
        <div className="inline-block animate-marquee text-4xl md:text-6xl italic" style={{ fontFamily: "'Playfair Display', serif", animation: 'marquee 20s linear infinite' }}>
          &nbsp;Academic Strategy — Creative Mentorship — College Prep — Literature — Philosophy — Critical Thinking — Academic Strategy — Creative Mentorship — College Prep — Literature — Philosophy — Critical Thinking —
        </div>
      </div>
    </div>
  );
};

const PhilosophySection = ({ onHover }) => {
  return (
    <section id="philosophy" className="py-24 md:py-40 px-4 md:px-12 w-full max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <span className="block text-xs font-bold uppercase tracking-widest mb-4 border-b border-black pb-2 inline-block">About Me</span>
        </div>
        <div className="md:col-span-8">
          <h2 className="text-4xl md:text-6xl font-light leading-tight mb-12 fade-up">
            I believe education is not just about <span className="italic" style={{ fontFamily: "'Playfair Display', serif" }}>absorbing facts</span>, but about constructing a unique worldview.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="fade-up">
              <p className="text-gray-600 leading-relaxed mb-6">
                With over 15 years of experience in higher education and private tutoring, I have developed a methodology that focuses on the individual learner's cognitive style.
              </p>
              <p className="text-gray-600 leading-relaxed">
                My approach blends Socratic questioning with modern pedagogical techniques to foster independence, resilience, and deep intellectual curiosity.
              </p>
              <a
                href="#about"
                className="inline-block mt-8 text-sm uppercase tracking-widest border-b border-black pb-1 relative"
                onMouseEnter={() => onHover(true)}
                onMouseLeave={() => onHover(false)}
                style={{
                  position: 'relative'
                }}
              >
                Read Full Bio
              </a>
            </div>
            <div className="relative h-[400px] fade-up">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop" alt="Teacher Portrait" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="absolute bottom-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest">Elena Vance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const OfferingCard = ({ number, title, description, image, delay, onHover }) => {
  return (
    <div
      className="group cursor-pointer"
      style={{ marginTop: delay ? '6rem' : '0' }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="w-full aspect-[4/5] overflow-hidden mb-6 bg-gray-100 relative">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10"></div>
        <img src={image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={title} />
        <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">{number}</div>
      </div>
      <div className="border-t border-black pt-4 flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold mb-2 group-hover:italic transition-all">{title}</h3>
          <p className="text-gray-500 text-sm max-w-[250px]">{description}</p>
        </div>
        <svg className="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </div>
    </div>
  );
};

const CurriculumSection = ({ onHover }) => {
  const offerings = [
    {
      number: '01',
      title: '1-on-1 Mentorship',
      description: 'Personalized academic guidance focusing on strengths and addressing weaknesses.',
      image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800&auto=format&fit=crop',
      delay: false
    },
    {
      number: '02',
      title: 'College Prep',
      description: 'Strategic application planning, essay workshops, and interview preparation.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
      delay: true
    },
    {
      number: '03',
      title: 'Group Workshops',
      description: 'Collaborative learning environments for literature, debate, and philosophy.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
      delay: false
    }
  ];

  return (
    <section id="curriculum" className="py-24 bg-white text-black px-4 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-24 border-b border-gray-200 pb-8">
          <h2 className="text-7xl md:text-9xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Offerings</h2>
          <div className="hidden md:block text-right">
            <p className="text-sm uppercase tracking-widest text-gray-500">Tailored Educational<br />Experiences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {offerings.map((offering, index) => (
            <OfferingCard key={index} {...offering} onHover={onHover} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const stats = [
    { value: '15+', label: 'Years Experience', delay: 0 },
    { value: '500+', label: 'Students Mentored', delay: 100 },
    { value: '100%', label: 'Dedication', delay: 200 },
    { value: '24', label: 'Workshops/Year', delay: 300 }
  ];

  return (
    <section className="py-20 bg-[#1a1a1a] text-[#f4f4f0] px-4 md:px-12 border-b border-gray-800">
      <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center md:text-left fade-up" style={{ transitionDelay: `${stat.delay}ms` }}>
            <div className="text-5xl md:text-7xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</div>
            <div className="text-xs uppercase tracking-widest text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ArticleItem = ({ number, date, title, image, onHover, onMouseMove }) => {
  return (
    <article
      className="group relative border-t border-black py-12 transition-colors hover:bg-gray-100"
      data-image={image}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onMouseMove={onMouseMove}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 z-10 relative">
        <div className="text-sm font-mono text-gray-500 mb-4 md:mb-0">{number} / {date}</div>
        <h3 className="text-3xl md:text-5xl font-light group-hover:italic transition-all duration-300">{title}</h3>
        <div className="hidden md:block">
          <span className="inline-block px-4 py-1 border border-black rounded-full text-xs uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-all">Read</span>
        </div>
      </div>
    </article>
  );
};

const JournalSection = ({ onHover }) => {
  const [hoverImage, setHoverImage] = useState({ src: '', active: false, x: 0, y: 0 });

  const articles = [
    { number: '01', date: 'OCT 24, 2023', title: 'The Socratic Method in Modern Classrooms', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop' },
    { number: '02', date: 'OCT 10, 2023', title: 'Resilience in Academic Pursuits', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop' },
    { number: '03', date: 'SEP 28, 2023', title: 'Designing a Curriculum for Curiosity', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop' },
    { number: '04', date: 'SEP 15, 2023', title: 'The Future of Standardized Testing', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=600&auto=format&fit=crop' }
  ];

  const handleMouseMove = (e, image) => {
    setHoverImage({
      src: image,
      active: true,
      x: e.clientX + 50,
      y: e.clientY - 100
    });
  };

  const handleMouseLeave = () => {
    setHoverImage(prev => ({ ...prev, active: false }));
  };

  return (
    <section id="journal" className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
        <h2 className="text-6xl md:text-8xl tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>Insights</h2>
        <a
          href="#"
          className="text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 transition-colors mt-8 md:mt-0"
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
        >
          View All Articles
        </a>
      </div>

      <div className="flex flex-col">
        {articles.map((article, index) => (
          <div
            key={index}
            onMouseMove={(e) => handleMouseMove(e, article.image)}
            onMouseLeave={handleMouseLeave}
          >
            <ArticleItem {...article} onHover={onHover} />
          </div>
        ))}
        <div className="border-b border-black"></div>
      </div>
      
      <img
        src={hoverImage.src}
        alt="Article Preview"
        className="fixed pointer-events-none z-50 rounded"
        style={{
          width: '300px',
          height: '200px',
          objectFit: 'cover',
          opacity: hoverImage.active ? 1 : 0,
          transform: hoverImage.active ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.3s, transform 0.3s',
          left: `${hoverImage.x}px`,
          top: `${hoverImage.y}px`
        }}
      />
    </section>
  );
};

const TestimonialSection = () => {
  return (
    <section className="py-32 bg-[#e6e6e2]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <svg className="w-12 h-12 mx-auto mb-8 text-black/20 fill-current" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-3xl md:text-5xl leading-tight mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          "Elena didn't just help my son with his grades; she transformed his entire approach to learning. He is now a confident, curious scholar."
        </p>
        <div className="flex flex-col items-center">
          <span className="font-bold uppercase tracking-widest text-sm">Sarah Jenkins</span>
          <span className="text-gray-500 text-sm mt-1">Parent, Class of 2023</span>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onHover }) => {
  return (
    <footer id="contact" className="bg-black text-[#f4f4f0] pt-32 pb-12 px-4 md:px-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          <div>
            <h2 className="text-6xl md:text-8xl tracking-tighter mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
              Let's shape the<br /><span className="text-gray-500 italic">future.</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-md leading-relaxed mb-12">
              Currently accepting new students for the Spring 2024 semester. Reach out to schedule a consultation.
            </p>
            <a
              href="mailto:hello@elenavance.edu"
              className="inline-flex items-center gap-4 text-2xl md:text-3xl border-b border-white/30 pb-2 hover:border-white transition-colors"
              onMouseEnter={() => onHover(true)}
              onMouseLeave={() => onHover(false)}
            >
              hello@elenavance.edu
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:pl-20">
            <div className="flex flex-col space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Navigation</span>
              <a href="#" className="hover:text-gray-400 transition-colors" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>Home</a>
              <a href="#philosophy" className="hover:text-gray-400 transition-colors" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>Philosophy</a>
              <a href="#curriculum" className="hover:text-gray-400 transition-colors" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>Curriculum</a>
              <a href="#journal" className="hover:text-gray-400 transition-colors" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>Journal</a>
            </div>
            <div className="flex flex-col space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Socials</span>
              <a href="#" className="hover:text-gray-400 transition-colors" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>LinkedIn</a>
              <a href="#" className="hover:text-gray-400 transition-colors" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>Twitter</a>
              <a href="#" className="hover:text-gray-400 transition-colors" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>Instagram</a>
            </div>
            <div className="col-span-2 mt-8">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Office</span>
              <p className="text-gray-400">
                123 Innovation Dr, Suite 400<br />
                San Francisco, CA 94103
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-12">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[15vw] md:text-[10vw] leading-none font-bold tracking-tighter opacity-10 select-none pointer-events-none">
              VANCE
            </h1>
          </div>
          <div className="flex gap-8 text-xs text-gray-500 uppercase tracking-widest">
            <span>© 2024 Elena Vance</span>
            <a href="#" className="hover:text-white transition-colors" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  const { cursorPosition, isHovered, setIsHovered } = useCustomCursor();
  
  useScrollAnimation();

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
      
      html {
        scroll-behavior: smooth;
      }
      
      body {
        cursor: none;
      }
      
      .fade-up {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
      }
      
      .fade-up.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      
      .animate-marquee {
        animation: marquee 20s linear infinite;
      }
    `;
    document.head.appendChild(styleEl);

    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);

    return () => document.head.removeChild(styleEl);
  }, []);

  return (
    <div className="antialiased selection:bg-black selection:text-white" style={customStyles.body}>
      <CustomCursor position={cursorPosition} isHovered={isHovered} />
      <Navigation onHover={setIsHovered} />
      <Header />
      <MarqueeSection />
      <PhilosophySection onHover={setIsHovered} />
      <CurriculumSection onHover={setIsHovered} />
      <StatsSection />
      <JournalSection onHover={setIsHovered} />
      <TestimonialSection />
      <Footer onHover={setIsHovered} />
    </div>
  );
};

export default App;