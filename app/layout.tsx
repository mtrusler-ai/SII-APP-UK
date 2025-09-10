import "./globals.css";

export const metadata = {
  title: "Startup Ideas Index — Deploy Check",
  description: "Deployment OK page",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
