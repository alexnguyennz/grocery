import { ReactNode } from 'react';

export default function Main({ children }: { children: ReactNode }) {
  return (
    <main className="container mx-auto px-3 py-10 flex flex-col flex-1">
      {children}
    </main>
  );
}
