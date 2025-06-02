import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Builder Codes Stats',
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
