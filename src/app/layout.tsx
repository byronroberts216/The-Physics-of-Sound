import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "The Physics of Sound", description: "Development foundation for an accessible acoustics learning project." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
