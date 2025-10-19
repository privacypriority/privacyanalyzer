'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      anchors: true,
      lerp: 1,            
      duration: 1.2,         
      smoothWheel: true,  
      wheelMultiplier: 1,  
      touchMultiplier: 1,  
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}