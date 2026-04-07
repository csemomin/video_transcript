import "./globals.css";

export const metadata = {
  title: "Extract & Transcribe",
  description: "Download and transcribe YouTube videos instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
