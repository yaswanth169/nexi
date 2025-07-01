import { Navbar } from '@/components/home/sections/navbar';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full relative">
      <div className="block w-px h-full fixed top-0 left-6 z-10"></div>
      <div className="block w-px h-full fixed top-0 right-6 z-10"></div>
      <Navbar />
      {children}
    </div>
  );
}
