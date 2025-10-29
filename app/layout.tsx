import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Pokedex",
  description: "Test Pokedex Web",
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
