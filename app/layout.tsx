import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";
import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/next';
import { Poppins } from "next/font/google";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { ToastProvider } from "@/components/ToastProvider";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Tapakila App",
  icons: {
    icon: "/assets/favicon.png",
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <SessionProvider>
          <div>
            <Navbar />
            <main className="pt-0">
              {children}
              <ToastContainer />
              <Toaster />
              <ToastProvider />
              <Analytics />
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}