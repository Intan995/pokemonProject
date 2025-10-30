import "./globals.css";
import { Providers } from "./providers"; //wrapper komponen yang biasa digunakan untuk mengakses diseluruh laman

//laman head
export const metadata = {
  title: "Pokedex",
  description: "Test Pokedex Web",
};

export default function RootLayout({
  children, //isi halaman yang akan dirender dilaman layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* //membungkus semua laman dengan providers */}
        <Providers>{children}</Providers> 
      </body>
    </html>
  );
}
