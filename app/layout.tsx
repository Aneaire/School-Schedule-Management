import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "~/components/Header";
import WelcomeCat from "~/components/WelcomeCat";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schedule Manager",
  description: "Manage your schedule with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
        >
          {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <SignInButton />
                <SignUpButton /> 
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header> */}
          <SignedOut>
            <div className=" w-full h-[100vh] flex justify-center items-center">
              <div className=" space-y-2">
                <WelcomeCat />
                <p className="text-center text-xl">
                  You need to{" "}
                  <SignInButton>
                    <span className=" bg-blue-600 cursor-pointer px-2 py-1 rounded">
                      Sign In
                    </span>
                  </SignInButton>{" "}
                  to start managing your schedule
                </p>
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <Header />
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
