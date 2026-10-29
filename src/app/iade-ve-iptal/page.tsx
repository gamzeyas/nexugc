import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "İade ve iptal · NexUGC" };

export default function Page() {
  return <LegalPage slug="iade-ve-iptal" />;
}
