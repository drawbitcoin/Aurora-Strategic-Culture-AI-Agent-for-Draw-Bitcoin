export const metadata = {
  title: 'Aurora · Draw Bitcoin',
  description: 'Strategic Culture Operator for Draw Bitcoin.',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0A0A0A' }}>
        {children}
      </body>
    </html>
  );
}