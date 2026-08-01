import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1B222C] text-[#9AA5B1] w-full px-0 py-10 sm:py-12 border-t border-[#3E4C59]/40">
      <div className="w-full px-4 sm:px-6">
        <div className="mx-0 max-w-6xl mx-auto flex flex-col items-center gap-6 sm:gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute h-6 w-6 rounded-full bg-[#3E4C59]" />
            <span className="absolute right-0 h-3 w-3 rounded-full bg-white" />
          </span>
          <span className="text-md font-semibold text-white">
            M&amp;F <span className="font-normal text-[#6B7684]">Technologies</span>
          </span>
        </div>

        {/* Links */}
        <div className="w-full flex flex-wrap justify-between gap-4 sm:gap-8 text-xs font-medium">
          <Link href="/news" className="hover:text-white transition-colors py-1">
            News
          </Link>

          <Link href="/case-studies" className="hover:text-white transition-colors py-1">
            Case Studies
          </Link>

          <Link href="/security" className="hover:text-white transition-colors py-1">
            Security &amp; Compliance
          </Link>

          <Link href="/status" className="hover:text-white transition-colors py-1">
            System Status
          </Link>

          <Link href="/careers" className="hover:text-white transition-colors py-1">
            Careers
          </Link>

          <Link href="/privacy" className="hover:text-white transition-colors py-1">
            Privacy Policy
          </Link>

          <Link href="/terms" className="hover:text-white transition-colors py-1">
            Terms of Service
          </Link>
        </div>

        <p className="text-xs text-[#6B7684] text-center">
          &copy; {new Date().getFullYear()} M&amp;F Technologies. All rights reserved.
        </p>
        </div>
      </div>
    </footer>
  );
}
