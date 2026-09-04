import { Metadata } from "next";
import { ProtocolDocs } from "@/features/docs/components/ProtocolDocs";

export const metadata: Metadata = {
  title: "API Documentation | Protocol & M&F Technologies",
  description:
    "Official API Documentation for Protocol & M&F Technologies core lending systems, credit scoring platforms, SMS gateway infrastructure, and event streaming webhooks.",
};

export default function DocsPage() {
  return <ProtocolDocs />;
}
