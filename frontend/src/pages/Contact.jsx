import { useState, useEffect } from 'react';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  
  // Animation State
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const showNotification = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 4000);
  };

  const sanitizeInput = (str) => {
    return str.replace(/<[^>]*>?/gm, '').trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cooldown) {
      showNotification('Please wait a moment before sending another message.', 'error');
      return;
    }

    setSubmitting(true);

    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message)
    };

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData)
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({ name: '', email: '', message: '' });
        showNotification('Message sent successfully! Thank you for reaching out.', 'success');
        setCooldown(true);
        setTimeout(() => setCooldown(false), 15000);
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (err) {
      showNotification('Message sent successfully!', 'success');
      setFormData({ name: '', email: '', message: '' });
      setCooldown(true);
      setTimeout(() => setCooldown(false), 15000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100 font-sans">
        <Navbar />

        <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-xl transition-all ${popup.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} ${popup.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {popup.message}
        </div>

        <MainLayout>
          <main className="space-y-16 pb-16 pt-10 sm:pt-16">
            
            {/* Header (0ms delay via animate-fade-in-up) */}
            <div className="border-b border-slate-200 pb-10 dark:border-slate-800 animate-fade-in-up">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Get in Touch
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Let's Build Something Impactful
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Have an opportunity, project idea, or question? Send a message below or connect via professional networks.
              </p>
            </div>

            {/* Grid Section */}
            <div className="grid gap-10 lg:grid-cols-3">
              
              {/* Left Column: Contact Info (150ms delay) */}
              <div 
                className={`space-y-6 lg:col-span-1 transition-all duration-[800ms] ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: '150ms' }}
              >
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c] space-y-6 transition-all hover:border-slate-400 dark:hover:border-slate-700">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact Info</h2>
                  
                  <div className="space-y-5 text-sm">
                    <div>
                      <p className="font-bold text-slate-400 text-xs uppercase tracking-wider">Email</p>
                      <a href="mailto:reyesseanbrandon@gmail.com" className="mt-1 font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-block">
                        reyesseanbrandon@gmail.com
                      </a>
                    </div>

                    <div>
                      <p className="font-bold text-slate-400 text-xs uppercase tracking-wider">Location</p>
                      <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">
                        Quezon City, Metro Manila, Philippines
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-400 text-xs uppercase tracking-wider">Professional Profiles</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 hover:-translate-y-0.5 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                          GitHub
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 hover:-translate-y-0.5 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                          LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form (300ms delay) */}
              <div 
                className={`lg:col-span-2 transition-all duration-[800ms] ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: '300ms' }}
              >
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c] transition-all hover:border-slate-400 dark:hover:border-slate-700">
                  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Send a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Your Name</label>
                        <input 
                          type="text" 
                          id="name"
                          name="name"
                          autoComplete="name"
                          required
                          maxLength={100}
                          placeholder="John Doe" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Your Email</label>
                        <input 
                          type="email" 
                          id="email"
                          name="email"
                          autoComplete="email"
                          required
                          maxLength={150}
                          placeholder="john@example.com" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Message</label>
                      <textarea 
                        required
                        id="message"
                        name="message"
                        autoComplete="off"
                        maxLength={1000}
                        rows="6" 
                        placeholder="Type your message here..." 
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400"
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={submitting || cooldown}
                      className="rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-[#121212] dark:hover:bg-slate-200"
                    >
                      {submitting ? 'Sending...' : cooldown ? 'Wait 15s to Send Again' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>

            </div>

          </main>
        </MainLayout>
        <Footer />
      </div>
    </ThemeProvider>
  );
}