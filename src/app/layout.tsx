import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowCraft - AI Workflow Builder",
  description: "Build AI workflows visually. Upload content, extract knowledge, and generate outputs with any LLM provider.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark h-full`}>
      <body className="h-full bg-background text-foreground antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
