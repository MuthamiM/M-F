"use client";

import { useRouter } from "next/navigation";

export default function RequestDemoButton({ className }: { className?: string }) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const ok = window.confirm("Would you like to request a demo? We'll ask a few details on the next page.");
    if (ok) {
      router.push("/request-demo");
    }
  }

  return (
    <button onClick={handleClick} className={className}>
      Request a demo
    </button>
  );
}
