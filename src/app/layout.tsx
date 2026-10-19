import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import "katex/dist/katex.min.css";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "The Physics of Sound",
    template: "%s · The Physics of Sound",
  },
  description:
    "Learn to reason about sound. A self-paced acoustics academy for curious musicians, with original lessons and interactive physics labs.",
};
const themeScript = `try{var s=JSON.parse(localStorage.getItem('physics-of-sound:v1')||'null');document.documentElement.dataset.theme=s&&s.theme==='light'?'light':'dark'}catch{}`;
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
