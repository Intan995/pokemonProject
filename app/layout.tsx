import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Next Pokédex Auth",
  description: "Pokedex with NextAuth authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
