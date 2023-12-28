import Image from 'next/image';
import { Inter } from 'next/font/google';
import Rotations from './rotations';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return <Rotations />;
}
