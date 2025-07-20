import "./globals.css";
import NavigationBar from "./NavigationBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col">
        <NavigationBar />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
