import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const customStyles = {
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
    borderColor: 'transparent'
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

    const linkCursors = document.querySelectorAll('.link-cursor');
    linkCursors.forEach(link => {
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      linkCursors.forEach(link => {
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
    <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-[#f4f4f0]/80 backdrop-blur-sm">
      <Link to="/" className="text-xl font-bold tracking-tighter uppercase link-cursor">Elena Vance®</Link>
      
      <div className="hidden md:flex items-center space-x-12">
        <a href="#philosophy" className="text-sm uppercase tracking-widest hover:text-gray-500 transition-colors link-cursor">Philosophy</a>
        <Link to="/" className="text-sm uppercase tracking-widest border-b border-black pb-1 link-cursor">Curriculum</Link>
        <a href="#journal" className="text-sm uppercase tracking-widest hover:text-gray-500 transition-colors link-cursor">Journal</a>
        <a href="#contact" className="text-sm uppercase tracking-widest hover:text-gray-500 transition-colors link-cursor">Contact</a>
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

const CourseCard = ({ subject, title, code, description, session, buttonText, imageUrl, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`course-card group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      data-subject={subject}
    >
      <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-gray-200">
        <img 
          src={imageUrl} 
          className="course-img w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
          alt={title}
        />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
          {subject.replace('-', ' ')}
        </div>
      </div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-3xl font-display group-hover:italic transition-all">{title}</h3>
        <span className="text-sm font-mono pt-2">{code}</span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">{description}</p>
      <div className="border-t border-black/10 pt-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-gray-500">Next Session</span>
          <span className="text-xs font-bold">{session}</span>
        </div>
        <button className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-gray-800 transition-colors link-cursor">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const CurriculumPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    setIsHeaderVisible(true);
  }, []);

  const courses = [
    {
      subject: 'literature',
      title: 'The Epic Tradition',
      code: 'LV-101',
      description: 'From Homer to Milton, an intensive survey of the hero\'s journey and the evolution of the Western narrative structure.',
      session: 'Feb 12 — Mar 20',
      buttonText: 'Enroll in Workshop',
      imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop',
      delay: 0
    },
    {
      subject: 'philosophy',
      title: 'Socratic Inquiry',
      code: 'LV-204',
      description: 'Developing the art of the question. A workshop focused on critical analysis, logic, and the foundations of ethics.',
      session: 'Mar 05 — Apr 15',
      buttonText: 'Enroll in Workshop',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      delay: 100
    },
    {
      subject: 'college-prep',
      title: 'Narrative Strategy',
      code: 'LV-400',
      description: 'Crafting the personal statement. Translating lived experience into compelling prose for elite university applications.',
      session: 'Ongoing / Summer Intake',
      buttonText: 'Book Consultation',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
      delay: 200
    },
    {
      subject: 'literature',
      title: 'Modernist Voices',
      code: 'LV-108',
      description: 'A deep dive into Woolf, Joyce, and Faulkner. Exploring stream of consciousness and the fragmentation of the modern self.',
      session: 'Apr 20 — Jun 01',
      buttonText: 'Enroll in Workshop',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
      delay: 0
    },
    {
      subject: 'philosophy',
      title: 'Existentialism',
      code: 'LV-302',
      description: 'Individual freedom and the search for meaning. Studying Camus, Sartre, and Kierkegaard through a modern lens.',
      session: 'May 10 — Jun 30',
      buttonText: 'Enroll in Workshop',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      delay: 100
    },
    {
      subject: 'college-prep',
      title: 'The Art of the Interview',
      code: 'LV-415',
      description: 'Interpersonal communication skills for university and scholarship interviews. Practical drills and confidence building.',
      session: 'Aug 01 — Aug 15',
      buttonText: 'Book Workshop',
      imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop',
      delay: 200
    }
  ];

  const filteredCourses = activeFilter === 'all' 
    ? courses 
    : courses.filter(course => course.subject === activeFilter);

  return (
    <main className="pt-32 pb-24 px-4 md:px-12 max-w-[1600px] mx-auto">
      <header className={`mb-20 transition-all duration-700 ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-center gap-4 mb-6">
          <span className="w-12 h-[1px] bg-black"></span>
          <span className="text-xs uppercase tracking-[0.3em] font-bold">Our Offerings</span>
        </div>
        <h1 className="font-display text-7xl md:text-9xl leading-[0.9] tracking-tighter mb-8">
          Curriculum <br /> <span className="italic text-gray-400">&amp; Workshops</span>
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-600 max-w-2xl leading-relaxed">
          A structured path toward intellectual autonomy. Explore our seasonal sessions across Literature, Philosophy, and Strategic College Preparation.
        </p>
      </header>

      <div className="flex flex-wrap gap-4 mb-16 border-b border-black/10 pb-8">
        <button 
          className={`filter-btn px-6 py-2 rounded-full border border-black text-xs uppercase tracking-widest transition-all link-cursor ${activeFilter === 'all' ? 'bg-black text-[#f4f4f0]' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Subjects
        </button>
        <button 
          className={`filter-btn px-6 py-2 rounded-full border border-black text-xs uppercase tracking-widest transition-all link-cursor ${activeFilter === 'literature' ? 'bg-black text-[#f4f4f0]' : ''}`}
          onClick={() => setActiveFilter('literature')}
        >
          Literature
        </button>
        <button 
          className={`filter-btn px-6 py-2 rounded-full border border-black text-xs uppercase tracking-widest transition-all link-cursor ${activeFilter === 'philosophy' ? 'bg-black text-[#f4f4f0]' : ''}`}
          onClick={() => setActiveFilter('philosophy')}
        >
          Philosophy
        </button>
        <button 
          className={`filter-btn px-6 py-2 rounded-full border border-black text-xs uppercase tracking-widest transition-all link-cursor ${activeFilter === 'college-prep' ? 'bg-black text-[#f4f4f0]' : ''}`}
          onClick={() => setActiveFilter('college-prep')}
        >
          College Prep
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {filteredCourses.map((course, index) => (
          <CourseCard key={`${course.code}-${index}`} {...course} />
        ))}
      </div>

      <section className="mt-40 py-24 bg-[#1a1a1a] text-[#f4f4f0] text-center -mx-4 md:-mx-12 px-4 md:px-12">
        <h2 className="text-5xl md:text-7xl font-display italic mb-8">Ready for the challenge?</h2>
        <p className="text-gray-400 mb-12 max-w-xl mx-auto">
          Customized private curricula are available for students seeking specialized preparation outside our seasonal group workshops.
        </p>
        <a 
          href="#contact" 
          className="inline-block border-b border-white pb-2 text-sm uppercase tracking-[0.3em] font-bold link-cursor relative"
          style={{
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.querySelector('.underline-anim').style.transform = 'scaleX(1)';
            e.currentTarget.querySelector('.underline-anim').style.transformOrigin = 'bottom left';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector('.underline-anim').style.transform = 'scaleX(0)';
            e.currentTarget.querySelector('.underline-anim').style.transformOrigin = 'bottom right';
          }}
        >
          Schedule a Consultation
          <span 
            className="underline-anim"
            style={{
              position: 'absolute',
              width: '100%',
              height: '1px',
              bottom: '-2px',
              left: 0,
              backgroundColor: 'currentColor',
              transform: 'scaleX(0)',
              transformOrigin: 'bottom right',
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          />
        </a>
      </section>
    </main>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-[#f4f4f0] pt-20 pb-12 px-4 md:px-12">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
        <div>
          <h1 className="text-[8vw] leading-none font-bold tracking-tighter opacity-10 select-none pointer-events-none mb-4">
            VANCE
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            © 2024 Elena Vance — Intellectual Agency
          </p>
        </div>
        <div className="flex gap-12 text-xs uppercase tracking-widest">
          <a href="#" className="link-cursor hover:text-gray-400 transition-colors">Instagram</a>
          <a href="#" className="link-cursor hover:text-gray-400 transition-colors">LinkedIn</a>
          <a href="#" className="link-cursor hover:text-gray-400 transition-colors">Newsletter</a>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
      
      body {
        font-family: 'Manrope', sans-serif;
        background-color: #f4f4f0;
        color: #1a1a1a;
        cursor: none;
        overflow-x: hidden;
      }
      
      .font-display {
        font-family: 'Playfair Display', serif;
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
        <Navigation />
        <Routes>
          <Route path="/" element={<CurriculumPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;