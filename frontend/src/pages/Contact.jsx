import { useState } from 'react';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate message sending (you can wire this to a backend route later if desired!)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100">
        <Navbar />

        <MainLayout>
          <main className="space-y-16 pb-20 pt-16 sm:pt-24">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-10 dark:border-slate-800">
              <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl dark:text-white">
                Get in Touch
              </h1>
              <p className="mt-4 max-w-2xl font-mono text-lg text-slate-600 dark:text-slate-400">
                Have an opportunity, project idea, or question? Send a message and let's build something impactful together.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              
              {/* Left Column: Direct Contact Info */}
              <div className="space-y-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
                  <h2 className="font-mono text-2xl font-bold text-slate-900 dark:text-white mb-6">Contact Information</h2>
                  
                  <div className="space-y-6 font-mono text-slate-700 dark:text-slate-300">
                    
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</p>
                        <a href="mailto:reyesseanbrandon@gmail.com" className="text-base font-semibold hover:underline">
                          reyesseanbrandon@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</p>
                        <a href="tel:09763092733" className="text-base font-semibold hover:underline">
                          0976 309 2733
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Location</p>
                        <p className="text-base font-semibold">Quezon City, Metro Manila, Philippines</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Form */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-4">
                    <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                    <h3 className="font-mono text-2xl font-bold dark:text-white">Message Sent!</h3>
                    <p className="font-mono text-slate-500 max-w-sm">
                      Thank you for reaching out. I'll get back to you as soon as possible.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-4 rounded-lg bg-slate-900 px-5 py-2.5 font-mono text-xs font-bold text-white dark:bg-white dark:text-[#121212]"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="font-mono text-2xl font-bold text-slate-900 dark:text-white mb-2">Send a Message</h2>
                    
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe" 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Your Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com" 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-[#121212] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message</label>
                      <textarea 
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Type your message here..." 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-[#121212] dark:text-white"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 font-mono text-sm font-bold text-white transition hover:opacity-90 dark:bg-white dark:text-[#121212]"
                    >
                      {loading ? 'Sending...' : <>Send Message <Send className="h-4 w-4" /></>}
                    </button>
                  </form>
                )}
              </div>

            </div>

          </main>
        </MainLayout>
        <Footer />
      </div>
    </ThemeProvider>
  );
}