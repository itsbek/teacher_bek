import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const customStyles = {
  body: {
    fontFamily: "'Manrope', sans-serif",
    backgroundColor: '#f4f4f0',
    color: '#1a1a1a',
    cursor: 'none',
    overflowX: 'hidden'
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
  }
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    const linkElements = document.querySelectorAll('.link-cursor');
    
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    linkElements.forEach(link => {
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      linkElements.forEach(link => {
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mouseleave', handleMouseLeave);
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

const Navigation = () => {
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

      <button 
        className="md:hidden link-cursor"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  );
};

const RelatedArticle = ({ date, title }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a 
      href="#" 
      className="group block link-cursor"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-[10px] font-mono text-gray-500 block mb-2">{date}</span>
      <h5 className={`text-xl font-display transition-all ${isHovered ? 'italic' : ''}`}>
        {title}
      </h5>
      <div 
        className="mt-3 h-[1px] bg-black transition-all duration-500"
        style={{ width: isHovered ? '100%' : '0' }}
      />
    </a>
  );
};

const NewsletterForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <div className="bg-white p-8 border border-black/5">
      <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Newsletter</h4>
      <p className="text-sm text-gray-600 mb-6">
        Receive monthly insights on educational strategy and pedagogical philosophy.
      </p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email Address" 
          className="bg-transparent border-b border-black py-2 text-sm focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button 
          type="submit"
          className="text-xs uppercase tracking-widest text-left font-bold border-b border-black pb-1 w-fit hover:text-gray-500 transition-colors link-cursor"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

const ShareButtons = () => {
  return (
    <div className="mt-20 flex gap-4">
      <a 
        href="#" 
        className="px-6 py-2 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all link-cursor"
      >
        Twitter
      </a>
      <a 
        href="#" 
        className="px-6 py-2 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all link-cursor"
      >
        LinkedIn
      </a>
      <a 
        href="#" 
        className="px-6 py-2 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all link-cursor"
      >
        Copy Link
      </a>
    </div>
  );
};

const AuthorBio = () => {
  return (
    <section className="py-20 px-4 md:px-12 max-w-[1600px] mx-auto border-t border-black/10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-3">
          <div className="aspect-square w-full max-w-[240px] grayscale overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop" 
              className="w-full h-full object-cover" 
              alt="Elena Vance" 
            />
          </div>
        </div>
        <div className="md:col-span-6">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">
            About the Author
          </span>
          <h3 className="text-3xl font-display mb-4">Elena Vance</h3>
          <p className="text-gray-600 leading-relaxed">
            Elena is an educational strategist and mentor with 15+ years of experience in higher education. 
            She specializes in crafting personalized learning paths for students seeking to bridge the gap 
            between traditional academics and creative problem-solving.
          </p>
          <div className="mt-6 flex gap-6">
            <a 
              href="/#philosophy" 
              className="text-xs uppercase tracking-widest font-bold border-b border-black pb-1 link-cursor relative"
            >
              View Profile
            </a>
            <a 
              href="/#contact" 
              className="text-xs uppercase tracking-widest font-bold border-b border-black pb-1 link-cursor relative"
            >
              Work with me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-[#f4f4f0] pt-20 pb-12 px-4 md:px-12 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-12">
          <div className="mb-4 md:mb-0">
            <h1 className="text-[10vw] leading-none font-bold tracking-tighter opacity-10 select-none pointer-events-none">
              VANCE
            </h1>
          </div>
          <div className="flex gap-8 text-xs text-gray-500 uppercase tracking-widest">
            <span>© 2024 Elena Vance</span>
            <a href="#" className="hover:text-white transition-colors link-cursor">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors link-cursor">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ArticlePage = () => {
  const articleRef = useRef(null);

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

    const elements = document.querySelectorAll('.fade-up');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div>
      <Navigation />

      <header className="pt-40 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto border-b border-black/10">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-8 fade-up visible">
            <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3 py-1">
              Education
            </span>
            <span className="text-xs font-mono text-gray-500">OCT 24, 2023 — 8 MIN READ</span>
          </div>
          <h1 
            className="font-display text-6xl md:text-8xl leading-[0.9] tracking-tighter mb-12 fade-up visible" 
            style={{ transitionDelay: '0.1s' }}
          >
            The Socratic Method in <br />
            <span className="italic">Modern Classrooms</span>
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl fade-up visible" 
            style={{ transitionDelay: '0.2s' }}
          >
            Moving beyond rote memorization to foster a generation of critical thinkers through the power of strategic questioning.
          </p>
        </div>
      </header>

      <main className="py-20 px-4 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div 
            className="lg:col-span-8 article-content fade-up visible" 
            style={{ transitionDelay: '0.3s' }}
            ref={articleRef}
          >
            <div className="w-full aspect-video mb-16 overflow-hidden bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop" 
                className="w-full h-full object-cover grayscale" 
                alt="Socratic Discussion" 
              />
            </div>

            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              In an era dominated by instant access to information, the role of the educator is shifting. 
              We are no longer the primary keepers of facts; rather, we are the architects of inquiry. 
              The Socratic Method, a form of cooperative argumentative dialogue based on asking and answering 
              questions to stimulate critical thinking, has never been more relevant than it is in today's digital landscape.
            </p>

            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              The essence of the Socratic approach lies not in the answers provided, but in the questions posed. 
              By challenging students to examine their underlying assumptions, we help them move beyond surface-level 
              understanding into the realm of true intellectual independence.
            </p>

            <h2 className="font-display text-4xl md:text-5xl mt-16 mb-6 tracking-tight">
              The Illusion of Certainty
            </h2>
            
            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              Modern education often prioritizes the "correct" answer over the process of discovery. 
              This creates a culture of intellectual fragility, where students are afraid to be wrong and 
              hesitant to explore the gray areas of complex subjects. The Socratic Method disrupts this by 
              celebrating the state of "aporia"—the philosophical puzzle or impasse that triggers deeper thought.
            </p>

            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              When I sit with a student and we dive into a text, my goal isn't to tell them what the author meant. 
              My goal is to ask, "Why do you think the author chose that specific word?" and "How does that choice 
              change your perception of the character's motivation?" Through this process, the student becomes the 
              active driver of their own learning journey.
            </p>

            <div className="my-16 py-12 border-y border-black/10 text-center italic font-display text-2xl md:text-3xl px-8">
              "Questioning is the beginning of wisdom, but the end of complacency."
            </div>

            <h2 className="font-display text-4xl md:text-5xl mt-16 mb-6 tracking-tight">
              Implementing Inquiry at Home
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              This methodology isn't restricted to the classroom. Parents can integrate Socratic dialogue into daily life. 
              Instead of providing solutions to every problem a child faces, try asking questions that lead them to their 
              own conclusions. It builds resilience, cognitive flexibility, and a sense of agency that standardized testing 
              simply cannot provide.
            </p>
            
            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              As we look toward the future of education, the most valuable skill we can impart is the ability to think 
              for oneself. The Socratic Method remains our most potent tool for achieving that aim.
            </p>
            
            <ShareButtons />
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="mb-12">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-8 border-b border-black pb-2">
                  Related Journal Entries
                </h4>
                <div className="space-y-8">
                  <RelatedArticle 
                    date="OCT 10, 2023"
                    title="Resilience in Academic Pursuits"
                  />
                  <RelatedArticle 
                    date="SEP 28, 2023"
                    title="Designing a Curriculum for Curiosity"
                  />
                  <RelatedArticle 
                    date="SEP 15, 2023"
                    title="The Future of Standardized Testing"
                  />
                </div>
              </div>

              <NewsletterForm />
            </div>
          </aside>
        </div>
      </main>

      <AuthorBio />
      <Footer />
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
      
      body {
        font-family: 'Manrope', sans-serif !important;
        background-color: #f4f4f0 !important;
        color: #1a1a1a !important;
        cursor: none !important;
        overflow-x: hidden !important;
      }
      
      .font-display {
        font-family: 'Playfair Display', serif !important;
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

      .article-content p {
        margin-bottom: 2rem;
        font-size: 1.125rem;
        line-height: 1.8;
        color: #374151;
      }

      .article-content h2 {
        font-family: 'Playfair Display', serif;
        font-size: 2.5rem;
        margin-top: 4rem;
        margin-bottom: 1.5rem;
        letter-spacing: -0.02em;
      }

      .grayscale {
        filter: grayscale(100%);
      }

      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Router basename="/">
      <div className="antialiased selection:bg-black selection:text-white">
        <CustomCursor />
        <Routes>
          <Route path="/" element={<ArticlePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;