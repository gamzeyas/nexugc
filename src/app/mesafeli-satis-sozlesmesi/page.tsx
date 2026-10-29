import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Mesafeli satış sözleşmesi · NexUGC" };

export default function Page() {
  return <LegalPage slug="mesafeli-satis-sozlesmesi" />;
}
