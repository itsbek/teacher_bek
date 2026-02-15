import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      zIndex: 1000,
      mixBlendMode: 'difference',
      color: 'white',
      pointerEvents: 'none'
    }}>
      <div style={{
        pointerEvents: 'auto',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
      }}>
        SIMON WOLFE<br />ENGLISH
      </div>
      <nav style={{
        display: 'flex',
        gap: '40px',
        pointerEvents: 'auto'
      }}>
        <Link to="/" style={{
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer'
        }}>Methodology</Link>
        <Link to="/" style={{
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer'
        }}>Modules</Link>
        <Link to="/" style={{
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer'
        }}>Journal</Link>
        <Link to="/" style={{
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer'
        }}>Contact</Link>
      </nav>
    </header>
  );
};

const Footer = () => {
  return (
    <footer style={{
      padding: '40px',
      borderTop: '1px solid black',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: '300px'
    }}>
      <div style={{
        fontFamily: "'Anton', 'Impact', sans-serif",
        fontSize: '15vw',
        lineHeight: 0.75,
        color: 'black',
        marginLeft: '-10px'
      }}>
        CONNECT.
      </div>
      <div style={{
        textAlign: 'right',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>EMAIL: STUDIO@WOLFE.ENG</a>
        <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>INSTAGRAM: @SYNTAX_ARCHITECT</a>
        <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>LINKEDIN: SIMON H. WOLFE</a>
        <br />
        <span>© 2024 S. WOLFE</span>
      </div>
    </footer>
  );
};

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 40, height: 40 });
  const [background, setBackground] = useState('#ccff00');

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interactables = document.querySelectorAll('a, button, input, textarea, .testimonial-card');
    
    const handleMouseEnter = () => {
      setSize({ width: 80, height: 80 });
      setBackground('#ff0055');
    };

    const handleMouseLeave = () => {
      setSize({ width: 40, height: 40 });
      setBackground('#ccff00');
    };

    interactables.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      width: `${size.width}px`,
      height: `${size.height}px`,
      background: background,
      borderRadius: '50%',
      pointerEvents: 'none',
      mixBlendMode: 'difference',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      transition: 'width 0.2s, height 0.2s',
      left: `${position.x}px`,
      top: `${position.y}px`
    }} />
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState(null);
  const [cardPositions, setCardPositions] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (window.innerWidth / 2 - e.pageX) / 50;
      const y = (window.innerHeight / 2 - e.pageY) / 50;
      
      setCardPositions([
        { x: x * 0.5, y: y * 0.5 },
        { x: x * 1.0, y: y * 1.0 },
        { x: x * 1.5, y: y * 1.5 }
      ]);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
    alert('Form submitted successfully!');
  };

  return (
    <main style={{ padding: '140px 40px 40px' }}>
      <div style={{
        fontSize: '12px',
        textTransform: 'uppercase',
        borderTop: '1px solid black',
        paddingTop: '10px',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>04. Transmission</span>
        <span>Enquiry Protocol</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '80px',
        marginBottom: '100px'
      }}>
        <section>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
          }}>
            <div style={{
              position: 'relative',
              borderBottom: focusedField === 'name' ? '2px solid #ff0055' : '2px solid black',
              transition: 'border-color 0.3s'
            }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '5px',
                letterSpacing: '1px'
              }}>Full Name / Entity</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="ARCHITECT NAME"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '10px 0 20px',
                  fontFamily: "'Anton', 'Impact', sans-serif",
                  fontSize: '3vw',
                  textTransform: 'uppercase',
                  outline: 'none',
                  color: 'black'
                }}
              />
            </div>

            <div style={{
              position: 'relative',
              borderBottom: focusedField === 'email' ? '2px solid #ff0055' : '2px solid black',
              transition: 'border-color 0.3s'
            }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '5px',
                letterSpacing: '1px'
              }}>Electronic Mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="ENCRYPTED@ADDRESS.COM"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '10px 0 20px',
                  fontFamily: "'Anton', 'Impact', sans-serif",
                  fontSize: '3vw',
                  textTransform: 'uppercase',
                  outline: 'none',
                  color: 'black'
                }}
              />
            </div>

            <div style={{
              position: 'relative',
              borderBottom: focusedField === 'message' ? '2px solid #ff0055' : '2px solid black',
              transition: 'border-color 0.3s'
            }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '5px',
                letterSpacing: '1px'
              }}>Objective / Scope</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                rows="3"
                placeholder="DESCRIBE YOUR SYNTACTIC NEEDS"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '10px 0 20px',
                  fontFamily: "'Anton', 'Impact', sans-serif",
                  fontSize: '3vw',
                  textTransform: 'uppercase',
                  outline: 'none',
                  color: 'black',
                  resize: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                alignSelf: 'flex-start',
                background: 'black',
                color: 'white',
                fontFamily: "'Anton', 'Impact', sans-serif",
                fontSize: '2vw',
                padding: '20px 60px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#ff0055';
                e.target.style.color = 'black';
                e.target.style.transform = 'skewX(-10deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'black';
                e.target.style.color = 'white';
                e.target.style.transform = 'skewX(0deg)';
              }}
            >
              INITIATE CONNECTION
            </button>
          </form>
        </section>

        <aside style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '60px'
        }}>
          <div style={{
            width: '100%',
            height: '400px',
            background: '#eee',
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid black',
            filter: 'grayscale(1) invert(1)'
          }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: '#ffee00',
              color: 'black',
              padding: '10px',
              fontFamily: "'Anton', 'Impact', sans-serif",
              fontSize: '1.5vw',
              mixBlendMode: 'normal',
              zIndex: 10
            }}>
              LONDON HQ: EC1V
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158857.72810651664!2d-0.2416814670415316!3d51.52877184090158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
              allowFullScreen=""
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                border: 0,
                mixBlendMode: 'multiply'
              }}
            />
          </div>

          <div>
            <div style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              borderTop: '1px solid black',
              paddingTop: '10px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Synchronous Hours (GMT)</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #ddd',
              fontSize: '14px'
            }}>
              <span>MON - THU</span>
              <span>09:00 - 18:00</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #ddd',
              fontSize: '14px'
            }}>
              <span>FRI</span>
              <span>09:00 - 15:00</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #ddd',
              fontSize: '14px'
            }}>
              <span>SAT - SUN</span>
              <span>ASYNCHRONOUS ONLY</span>
            </div>
          </div>
        </aside>
      </div>

      <section>
        <div style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          borderTop: '1px solid black',
          paddingTop: '10px',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>05. Feedback Loop</span>
          <span>Peer Review</span>
        </div>

        <div style={{
          position: 'relative',
          height: '400px',
          marginTop: '100px',
          overflow: 'visible'
        }}>
          <div
            className="testimonial-card"
            style={{
              position: 'absolute',
              background: 'white',
              border: '1px solid black',
              padding: '30px',
              width: '350px',
              boxShadow: '20px 20px 0 black',
              zIndex: 10,
              top: 0,
              left: 0,
              borderTop: '5px solid #8000ff',
              transform: `translate(${cardPositions[0].x}px, ${cardPositions[0].y}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <p style={{
              fontSize: '16px',
              fontStyle: 'italic',
              marginBottom: '20px',
              lineHeight: 1.4
            }}>
              "The structural clarity Wolfe brought to our legal briefs changed how we win cases. It's not grammar, it's weapons-grade syntax."
            </p>
            <div style={{
              fontFamily: "'Anton', 'Impact', sans-serif",
              textTransform: 'uppercase',
              fontSize: '1.2rem'
            }}>
              DR. ELARA VOSS
            </div>
          </div>

          <div
            className="testimonial-card"
            style={{
              position: 'absolute',
              background: 'white',
              border: '1px solid black',
              padding: '30px',
              width: '350px',
              boxShadow: '20px 20px 0 black',
              zIndex: 10,
              top: '120px',
              left: '450px',
              borderTop: '5px solid #ff0055',
              transform: `translate(${cardPositions[1].x}px, ${cardPositions[1].y}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <p style={{
              fontSize: '16px',
              fontStyle: 'italic',
              marginBottom: '20px',
              lineHeight: 1.4
            }}>
              "Simon doesn't teach you English. He teaches you how to build worlds with it. Transformative experience for my editorial team."
            </p>
            <div style={{
              fontFamily: "'Anton', 'Impact', sans-serif",
              textTransform: 'uppercase',
              fontSize: '1.2rem'
            }}>
              MARCUS K. | CEO
            </div>
          </div>

          <div
            className="testimonial-card"
            style={{
              position: 'absolute',
              background: 'white',
              border: '1px solid black',
              padding: '30px',
              width: '350px',
              boxShadow: '20px 20px 0 black',
              zIndex: 10,
              top: '40px',
              right: 0,
              borderTop: '5px solid #ccff00',
              transform: `translate(${cardPositions[2].x}px, ${cardPositions[2].y}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <p style={{
              fontSize: '16px',
              fontStyle: 'italic',
              marginBottom: '20px',
              lineHeight: 1.4
            }}>
              "A brutalist approach to language that strips away the fluff. Exactly what the tech sector needed."
            </p>
            <div style={{
              fontFamily: "'Anton', 'Impact', sans-serif",
              textTransform: 'uppercase',
              fontSize: '1.2rem'
            }}>
              SARAH CHEN
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;700&display=swap');
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      
      body {
        background-color: #ffffff;
        color: #000000;
        font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
        overflow-x: hidden;
        width: 100vw;
      }
      
      input::placeholder,
      textarea::placeholder {
        color: rgba(0,0,0,0.1);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Router basename="/">
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <CursorFollower />
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 900,
          opacity: 0.05,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
        }} />
        <Header />
        <Routes>
          <Route path="/" element={<ContactPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;