export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200 dark:border-slate-700">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 dark:text-slate-300">
        <p>© 2026 Sean Brandon F. Reyes</p>
        <div className="flex items-center gap-4">
          <a href="mailto:reyesseanbrandon@gmail.com" className="transition hover:text-slate-900 dark:hover:text-slate-100">
            reyesseanbrandon@gmail.com
          </a>
          <a href="#top" className="transition hover:text-slate-900 dark:hover:text-slate-100">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}