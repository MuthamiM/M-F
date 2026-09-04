import { Metadata } from "next";
import { DocsPortal } from "@/features/docs/components/DocsPortal";

export const metadata: Metadata = {
  title: "API Reference & Developer Documentation | M&F Technologies",
  description:
    "Interactive API reference and sandbox for M&F Technologies core lending engines, algorithmic credit scoring, CRM collections, and transactional middleware.",
};

export default function DocsPage() {
  return <DocsPortal />;
}
