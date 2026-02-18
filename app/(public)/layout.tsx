import { PublicLayout } from '@/components/layout/PublicLayout';
import { ReactNode } from 'react';

export default function PublicLayoutPage({
  children,
}: {
  children: ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
