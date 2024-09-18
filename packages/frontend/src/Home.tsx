import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        navigate('/dashboard');
        location.href;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        'h-full w-full overflow-hidden',
        'relative flex flex-col items-center justify-center antialiased',
      )}
    >
      <AuroraBackground className="h-screen w-screen relative md:top-0 top-[-10%] px-4 md:px-0">
        <h1
          className={cn(
            'relative z-10 ',
            'text-4xl md:text-7xl bg-clip-text text-transparent text-center font-bold',
            'dark:bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-600 text-neutral-800',
          )}
        >
          Welcome to MetaPass
        </h1>
        <p
          className={cn(
            'text-sm md:text-base text-center',
            'dark:text-neutral-400 text-neutral-600 max-w-xl mx-auto mb-4 mt-6  relative z-10',
          )}
        >
          Step into the future of event ticketing with MetaPass. <br />
          Our blockchain-powered platform offers unparalleled
          <span className="font-bold  mx-1 text-base">security</span> and efficiency for
          event organizers and attendees. <br />
          From concerts to conferences, experience seamless,
          <span className="font-bold  mx-1 text-base">fraud-free</span> ticketing
          that&apos;s changing the game.
        </p>
        <div
          className={cn(
            'flex justify-center space-x-4 mt-4 relative z-10',
            'text-foreground',
          )}
        >
          <Button variant="outline" asChild>
            <NavLink to="/dashboard">Enter</NavLink>
          </Button>
        </div>
      </AuroraBackground>
    </div>
  );
};

export default Home;
