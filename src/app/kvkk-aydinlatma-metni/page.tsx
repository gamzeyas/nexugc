import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "KVKK aydınlatma metni · NexUGC" };

export default function Page() {
  return <LegalPage slug="kvkk-aydinlatma-metni" />;
}
