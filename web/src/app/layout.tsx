import "./globals.css";

export const metadata = { title: "Remedy Dragon", description: "Educational TCM & supplements" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <a href="/" className="font-semibold">Remedy Dragon</a>
            <div className="flex gap-4 text-sm">
              <a href="#" className="underline">Supplements</a>
              <a href="#" className="underline">TCM</a>
              <a href="#" className="underline">Check</a>
              <a href="#" className="underline">Account</a>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
