// web/src/app/layout.tsx
import "./globals.css";
import Link from "next/link"; // ⬅️ add this

export const metadata = { title: "Remedy Dragon", description: "Educational TCM & supplements" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/" className="font-semibold">
              Remedy Dragon
            </Link>{" "}
            {/* ⬅️ was <a href="/"> */}
            <div className="flex gap-4 text-sm">
              <Link href="/supplements" className="underline">
                Supplements
              </Link>
              <Link href="/tcm" className="underline">
                TCM
              </Link>
              <Link href="/check" className="underline">
                Check
              </Link>
              <Link href="/account" className="underline">
                Account
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
