import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Manish Bhagat Portfolio',
  description: 'Personal developer portfolio of Manish Bhagat, CS & Engineering candidate specializing in Full-Stack Web Development, Data Structures & Algorithms, and modern software engineering.',
  keywords: ['Manish Bhagat', 'Software Developer', 'Full-Stack Developer', 'Computer Science', 'React', 'Next.js', 'Node.js', 'Portfolio'],
  authors: [{ name: 'Manish Bhagat' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark selection:bg-[#58A6FF] selection:text-[#090909]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#090909] text-[#F5F5F5] antialiased selection:bg-[#58A6FF] selection:text-[#090909]">
        {children}
      </body>
    </html>
  );
}
