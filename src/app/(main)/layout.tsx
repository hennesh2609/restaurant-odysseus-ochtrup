import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventBanner } from "@/components/EventBanner";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EventBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
