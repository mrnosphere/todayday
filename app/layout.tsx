// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "todayday! — All the News That's Fit to Be Baffled By",
  description: "AI-curated daily weird and funny local news stories from your state.",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📰</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#faf8f3" }}>
        {children}
      </body>
    </html>
  );
}
