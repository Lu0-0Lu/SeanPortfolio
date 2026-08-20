import { FileText, User, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200 dark:border-slate-700">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Sean Brandon F. Reyes</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">© 2026 All rights reserved.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
          <a href="mailto:reyesseanbrandon@gmail.com" className="inline-flex items-center gap-2 transition hover:text-slate-900 dark:hover:text-slate-100">
            <Mail className="h-4 w-4" /> Email
          </a>
          <a href="https://www.linkedin.com/in/seanbrandonreyes/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-slate-900 dark:hover:text-slate-100">
            <User className="h-4 w-4" /> LinkedIn
          </a>
          <a href="https://docs.google.com/document/d/1yvlEqrm_l_mTN755gD_B0eWeCGP8OplJVW1Beu6qzoI/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-slate-900 dark:hover:text-slate-100">
            <FileText className="h-4 w-4" /> Resume
          </a>
          <a href="#top" className="ml-auto inline-flex items-center gap-2 transition hover:text-slate-900 dark:hover:text-slate-100 lg:ml-4">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}