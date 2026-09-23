import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SpaceBackground } from "@/components/space/SpaceBackground";
import { SkipLink } from "@/components/ui/SkipLink";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Shishir Dev | Backend & Systems Developer",
    template: "%s | Shishir Dev",
  },
  description:
    "Personal engineering portfolio of Shishir Dev, exploring backend development, Linux kernel internals, computer networking, and resilient systems.",
  keywords: [
    "Shishir Dev",
    "Backend Developer",
    "Systems Engineer",
    "Linux",
    "Python",
    "Computer Networking",
    "Data Structures",
    "Durgapur India",
  ],
  authors: [{ name: "Shishir Dev", url: "https://github.com/coopeace" }],
  creator: "Shishir Dev",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://shishirdev.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Shishir Dev",
    title: "Shishir Dev | Backend & Systems Developer",
    description:
      "Explore high-performance systems, backend services, networking tools, and technical mission logs.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#010206",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-accent selection:text-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          <SpaceBackground />
          <SkipLink />
          <Navbar />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 focus:outline-none relative z-10"
          >
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
