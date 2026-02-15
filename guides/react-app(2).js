import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const customStyles = {
  body: {
    fontFamily: "'Manrope', sans-serif",
    backgroundColor: '#f4f4f0',
    color: '#1a1a1a'
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
    borderColor: 'transparent'
  }
};

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };

    document.addEventListener('mousemove', moveCursor);
    return () => document.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const linkCursors = document.querySelectorAll('.link-cursor');
    linkCursors.forEach(link => {
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      linkCursors.forEach(link => {
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  });

  return (
    <div
      ref={cursorRef}
      style={{
        ...customStyles.cursor,
        ...(isHovered ? customStyles.cursorHovered : {})
      }}
    />
  );
};

const FadeUpElement = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
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

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-[#f4f4f0]/80 backdrop-blur-md">
      <a href="#" className="text-xl font-bold tracking-tighter uppercase link-cursor">Elena Vance®</a>
      
      <div className="hidden md:flex items-center space-x-12">
        <a href="#consultation" className="text-sm uppercase tracking-widest hover:text-gray-500 transition-colors link-cursor">Consultation</a>
        <a href="#scheduling" className="text-sm uppercase tracking-widest hover:text-gray-500 transition-colors link-cursor">Scheduling</a>
        <a href="#availability" className="text-sm uppercase tracking-widest hover:text-gray-500 transition-colors link-cursor">Availability</a>
        <a href="#" className="text-sm uppercase tracking-widest hover:text-gray-500 transition-colors link-cursor">Home</a>
      </div>

      <button 
        className="md:hidden link-cursor"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </nav>
  );
};

const ConsultationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gradeStatus: '',
    areaOfInterest: 'Mentorship',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Inquiry sent successfully!');
  };

  return (
    <section id="consultation" className="lg:col-span-7">
      <FadeUpElement delay={0.3}>
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest border-b border-black pb-2 inline-block mb-8">01 / The Inquiry</span>
        </div>
        
        <form className="space-y-12" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                className="input-underline link-cursor bg-transparent border-none border-b border-[#1a1a1a] px-0 py-4 w-full transition-all outline-none focus:border-b-2" 
                placeholder="e.g. Julianne Moore"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500">Email Address</label>
              <input 
                type="email" 
                name="email"
                className="input-underline link-cursor bg-transparent border-none border-b border-[#1a1a1a] px-0 py-4 w-full transition-all outline-none focus:border-b-2" 
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500">Current Grade / Status</label>
              <input 
                type="text" 
                name="gradeStatus"
                className="input-underline link-cursor bg-transparent border-none border-b border-[#1a1a1a] px-0 py-4 w-full transition-all outline-none focus:border-b-2" 
                placeholder="e.g. 11th Grade"
                value={formData.gradeStatus}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500">Area of Interest</label>
              <select 
                name="areaOfInterest"
                className="input-underline link-cursor appearance-none bg-transparent border-none border-b border-[#1a1a1a] px-0 py-4 w-full transition-all outline-none focus:border-b-2"
                value={formData.areaOfInterest}
                onChange={handleInputChange}
              >
                <option>Mentorship</option>
                <option>College Prep</option>
                <option>Writing Workshop</option>
                <option>General Inquiry</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500">How can I help you?</label>
            <textarea 
              name="message"
              className="input-underline link-cursor min-h-[150px] resize-none bg-transparent border-none border-b border-[#1a1a1a] px-0 py-4 w-full transition-all outline-none focus:border-b-2" 
              placeholder="Tell me about your academic goals..."
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>

          <button 
            type="submit"
            className="bg-black text-white px-12 py-5 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors link-cursor flex items-center gap-4"
          >
            Send Inquiry 
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>
      </FadeUpElement>
    </section>
  );
};

const AvailabilitySection = () => {
  return (
    <section id="availability">
      <FadeUpElement delay={0.4}>
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest border-b border-black pb-2 inline-block mb-8">02 / Availability</span>
        </div>
        <div className="bg-white p-8 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Status</span>
            <span className="text-xs uppercase bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">Limited Slots</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Spring 2024 semester: 4 slots remaining for 1-on-1 mentorship. Workshops are open for enrollment.
          </p>
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-xs uppercase tracking-widest">
              <span>Mon — Thu</span>
              <span>09:00 - 18:00</span>
            </div>
            <div className="flex justify-between text-xs uppercase tracking-widest">
              <span>Friday</span>
              <span>09:00 - 15:00</span>
            </div>
            <div className="flex justify-between text-xs uppercase tracking-widest text-gray-400">
              <span>Weekend</span>
              <span>By Request</span>
            </div>
          </div>
        </div>
      </FadeUpElement>
    </section>
  );
};

const Calendar = () => {
  const [selectedDay, setSelectedDay] = useState(6);

  const days = [
    { day: 28, available: false },
    { day: 29, available: false },
    { day: 30, available: false },
    { day: 31, available: false },
    { day: 1, available: true },
    { day: 2, available: false },
    { day: 3, available: false },
    { day: 4, available: true },
    { day: 5, available: true },
    { day: 6, available: true },
    { day: 7, available: true },
    { day: 8, available: true },
    { day: 9, available: false },
    { day: 10, available: false },
    { day: 11, available: true },
    { day: 12, available: true },
    { day: 13, available: true },
    { day: 14, available: true },
    { day: 15, available: true },
    { day: 16, available: false },
    { day: 17, available: false }
  ];

  const handleDayClick = (day, available) => {
    if (available) {
      setSelectedDay(day);
    }
  };

  return (
    <section id="scheduling">
      <FadeUpElement delay={0.5}>
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest border-b border-black pb-2 inline-block mb-8">03 / Quick Schedule</span>
        </div>
        <div className="bg-white p-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-sm uppercase">November 2024</h4>
            <div className="flex gap-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="cursor-pointer link-cursor"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="cursor-pointer link-cursor"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-[1px] bg-[#e2e2da] border border-[#e2e2da]">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <div key={index} className="bg-[#f4f4f0] aspect-square flex items-center justify-center text-[10px] font-bold text-gray-400">
                {day}
              </div>
            ))}
            {days.map((dayObj, index) => (
              <div
                key={index}
                className={`bg-[#f4f4f0] aspect-square flex items-center justify-center text-sm transition-all ${
                  !dayObj.available 
                    ? 'text-[#ccc] pointer-events-none' 
                    : selectedDay === dayObj.day
                    ? 'bg-[#1a1a1a] text-[#f4f4f0]'
                    : 'hover:bg-[#1a1a1a] hover:text-[#f4f4f0] cursor-pointer'
                }`}
                onClick={() => handleDayClick(dayObj.day, dayObj.available)}
              >
                {dayObj.day}
              </div>
            ))}
          </div>
          <p className="mt-6 text-[11px] text-gray-400 italic">* Selected: Intro Consultation (30 mins)</p>
        </div>
      </FadeUpElement>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The strategic depth Elena brings to college prep is unparalleled. She sees the student beyond the scores.",
      name: "Marcus Thorne",
      title: "Admissions Director",
      delay: 0
    },
    {
      quote: "Transitioning from rote learning to critical thinking was the best gift my daughter received this year.",
      name: "Leila Chen",
      title: "Parent of Scholar",
      delay: 0.1
    },
    {
      quote: "Elena's philosophy workshops helped me find my voice in a way that standard English classes never did.",
      name: "Soren K.",
      title: "Student, Oxford University",
      delay: 0.2
    }
  ];

  return (
    <section className="mt-40 border-t border-black pt-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {testimonials.map((testimonial, index) => (
          <FadeUpElement key={index} delay={testimonial.delay}>
            <div>
              <p className="text-lg font-serif italic mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                "{testimonial.quote}"
              </p>
              <div>
                <span className="block font-bold text-xs uppercase tracking-widest">{testimonial.name}</span>
                <span className="text-[10px] text-gray-500 uppercase">{testimonial.title}</span>
              </div>
            </div>
          </FadeUpElement>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-[#f4f4f0] pt-24 pb-12 px-4 md:px-12 mt-20">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-12">
        <div className="mb-4 md:mb-0">
          <h1 className="text-[8vw] leading-none font-bold tracking-tighter opacity-10 select-none">CONTACT</h1>
        </div>
        <div className="flex gap-8 text-xs text-gray-500 uppercase tracking-widest">
          <span>© 2024 Elena Vance</span>
          <a href="#" className="hover:text-white transition-colors link-cursor">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

const ContactPage = () => {
  useEffect(() => {
    const fontLink1 = document.createElement('link');
    fontLink1.rel = 'preconnect';
    fontLink1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(fontLink1);

    const fontLink2 = document.createElement('link');
    fontLink2.rel = 'preconnect';
    fontLink2.href = 'https://fonts.gstatic.com';
    fontLink2.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink2);

    const fontLink3 = document.createElement('link');
    fontLink3.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap';
    fontLink3.rel = 'stylesheet';
    document.head.appendChild(fontLink3);

    return () => {
      document.head.removeChild(fontLink1);
      document.head.removeChild(fontLink2);
      document.head.removeChild(fontLink3);
    };
  }, []);

  return (
    <div className="antialiased selection:bg-black selection:text-white" style={customStyles.body}>
      <CustomCursor />
      <Navigation />
      
      <main className="pt-32 pb-24 px-4 md:px-12 max-w-[1600px] mx-auto">
        <div className="mb-24">
          <h1 className="text-[10vw] leading-[0.85] tracking-tight mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Begin your <br /><span className="italic text-gray-400">consultation.</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-600 max-w-2xl">
            Every academic journey starts with a conversation. Share your goals, and let's explore how we can bridge the gap together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <ConsultationForm />
          
          <aside className="lg:col-span-5 space-y-24">
            <AvailabilitySection />
            <Calendar />
          </aside>
        </div>

        <Testimonials />
      </main>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<ContactPage />} />
      </Routes>
    </Router>
  );
};

export default App;