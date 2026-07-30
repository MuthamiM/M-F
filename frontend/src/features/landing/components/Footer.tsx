import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-graphite text-fog px-6 py-12 border-t border-slate">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute h-6 w-6 rounded-full bg-slate" />
            <span className="absolute right-0 h-3 w-3 rounded-full bg-white" />
          </span>
          <span className="text-md font-semibold text-white">
            M&amp;F <span className="font-normal text-silver">Technologies</span>
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-xs font-medium">
          <Link href="#privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="#terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="#security" className="hover:text-white transition-colors">
            Security Compliance
          </Link>
          <Link href="#cookies" className="hover:text-white transition-colors">
            Cookie Preferences
          </Link>
        </div>

        <p className="text-xs text-silver">
          &copy; {new Date().getFullYear()} M&amp;F Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
