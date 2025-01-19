import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'HYPE Stats',
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
