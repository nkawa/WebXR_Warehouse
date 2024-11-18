import Script from 'next/script';

import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WebXR Warehouse",
  description: "Developed by UCLab/Nobuo Kawaguchi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="jp">
      <head>
      <Script src="http://localhost:8097"></Script>
      </head>
      <body
        className={inter.className}
      >
        {children}
      </body>
    </html>
  );
}
