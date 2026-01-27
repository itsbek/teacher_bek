"use client";

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Check, Loader2, Users, BookOpen, GraduationCap } from 'lucide-react';

type SubscriberType = 'student' | 'parent' | 'teacher' | '';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscriberType, setSubscriberType] = useState<SubscriberType>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const subscriberTypes = [
    { value: 'student', label: 'Student', icon: GraduationCap, description: 'Learning English' },
    { value: 'parent', label: 'Parent', icon: Users, description: 'Supporting my child' },
    { value: 'teacher', label: 'Teacher', icon: BookOpen, description: 'Teaching English' },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !subscriberType) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subscriberType }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Thanks for subscribing!');
        setEmail('');
        setSubscriberType('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section ref={sectionRef} className="section relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03]"
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary to-transparent rounded-full blur-3xl" />
        </motion.div>
      </div>

      <div className="container-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl mx-auto p-8 md:p-12 lg:p-16 rounded-3xl bg-card border border-border overflow-hidden"
        >
          {/* Corner decorations */}
          <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-primary/30" />
          <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-primary/30" />
          <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-primary/30" />
          <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-primary/30" />

          {/* Content */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-accent tracking-wider uppercase text-primary bg-primary/10 rounded-full"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </motion.span>
              Free Resources
            </motion.div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
              Level Up Your English
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Join 500+ learners, parents, and teachers. Get weekly tips, resources, and exclusive content delivered to your inbox.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4"
                >
                  <Check className="w-8 h-8 text-green-500" />
                </motion.div>
                <p className="text-lg font-medium text-foreground mb-2">You're all set!</p>
                <p className="text-muted-foreground text-sm">{message}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Subscriber Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3 text-center">
                    I am a...
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {subscriberTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = subscriberType === type.value;
                      return (
                        <motion.button
                          key={type.value}
                          type="button"
                          onClick={() => setSubscriberType(type.value)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-xl border text-center transition-all duration-300 ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-lg'
                              : 'border-border hover:border-primary/30 hover:bg-muted/50'
                          }`}
                        >
                          <motion.div
                            animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                            className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>
                          <div className="font-medium text-sm text-foreground">{type.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{type.description}</div>
                          {isSelected && (
                            <motion.div
                              layoutId="selected-indicator"
                              className="absolute inset-0 rounded-xl border-2 border-primary"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Email Input */}
                <div className="relative max-w-md mx-auto">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <motion.button
                    type="submit"
                    disabled={status === 'loading' || !email || !subscriberType}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Subscribe for Free
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Error Message */}
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-red-500"
                  >
                    {message}
                  </motion.p>
                )}

                {/* Privacy Note */}
                <p className="text-center text-xs text-muted-foreground">
                  No spam, ever. Unsubscribe anytime. Your email is safe with me.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
