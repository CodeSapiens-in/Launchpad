import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { getServerSession } from "@/lib/auth";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CodeSapiens",
  description: "The intelligent coding assistant",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   // Fetch session details server-side
   const session = await getServerSession(); 
  return (
    <html lang="en" className={GeistSans.className}>
    <body className="bg-background text-foreground">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
           {session && (
            <nav className="bg-primary text-white py-4">
              <div className="container mx-auto flex justify-between items-center">
                <div className="text-lg font-bold">CodeSapiens</div>
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link href="/logout">Logout</Link>
                  </li>
                </ul>
              </div>
            </nav>
          )}
            <main className="min-h-screen flex flex-col">
                {children}
            </main>
        </ThemeProvider>
    </body>
</html>
);
}
