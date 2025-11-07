export const metadata = {
  title: 'Enterprise Agentic IDE',
  description: 'Next-generation development environment with AI agents',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
