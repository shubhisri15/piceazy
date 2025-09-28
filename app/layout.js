import { Noto_Sans } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from '@/components/header';
import ConvexClientProvider from '@/components/ConvexClientProvider';
import { ClerkProvider } from '@clerk/nextjs';

const notoSans = Noto_Sans({
      subsets: ['latin'], // Specify the necessary subsets
      weight: ['400', '700'], // Define the weights you need
      display: 'swap', // Recommended for performance
    });

export const metadata = {
  title: "PicEZ",
  description: "AI powered photo editor",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${notoSans.className} antialiased`}
        >
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ConvexClientProvider>
                <Header />
                <main>
                  {children}
                </main> 
              </ConvexClientProvider> 
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
    
  );
}
