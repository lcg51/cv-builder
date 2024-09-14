import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth, signIn, signOut } from "@/auth";
import UserButton from "./components/UserButton";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Next CMS App",
  description: "CMS brought by Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  return (
    <SessionProvider basePath='/api/auth' session={session}>
      <html lang='en'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className='ext-white font-bold bg-green-900 text-2xl p-2 mb-3 rounded-b-lg shadow-gray-700 shadow-lg flex'>
            <div className='flex flex-grow'>
              <Link href='/'>CMS</Link>
            </div>
            <div>
              <UserButton
                onSignIn={async () => {
                  "use server";
                  await signIn();
                }}
                onSignOut={async () => {
                  "use server";
                  await signOut();
                }}
              />
            </div>
          </header>
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
