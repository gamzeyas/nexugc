import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Kullanım koşulları · NexUGC" };

export default function Page() {
  return <LegalPage slug="kullanim-kosullari" />;
}
