import '../styles/main.scss';

import { Providers } from 'client/redux/provider';

export const metadata = {
  title: 'El Gualcal',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>{children}</Providers>
    </html>
  );
}
