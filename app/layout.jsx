import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Kick Home Care | Kara Asani Zindagi Main',
  description: "Pakistan's premier home care e-commerce platform for Shoe Care, Bleach, Liquid Cleaners, Drain Openers, and Pest Control Solutions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="font-sans bg-white text-slate-800 antialiased min-h-screen flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
