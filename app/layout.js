import "./globals.css";

export const metadata = {
  title: "Loadout | Strategy Board",
  description: "A personal strategy board for your next match.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}