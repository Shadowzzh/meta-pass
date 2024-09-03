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
        'h-screen w-screen',
        'relative flex flex-col items-center justify-center antialiased',
      )}
    >
      <AuroraBackground className="h-screen w-screen">
        <h1
          className={cn(
            'relative z-10 ',
            'text-4xl md:text-7xl bg-clip-text text-transparent text-center font-bold',
            'bg-gradient-to-b from-neutral-200 to-neutral-600 ',
          )}
        >
          Welcome to MetaPass
        </h1>
        <p
          className={cn(
            'text-sm md:text-base text-center',
            'text-neutral-400 max-w-xl mx-auto my-4  relative z-10',
          )}
        >
          Step into the future of event ticketing with MetaPass. Our blockchain-powered
          platform offers unparalleled security and efficiency for event organizers and
          attendees. From concerts to conferences, experience seamless, fraud-free
          ticketing that&apos;s changing the game.
        </p>
        <div
          className={cn(
            'flex justify-center space-x-4 mt-4 relative z-10',
            'text-foreground',
          )}
        >
          <Button variant="secondary" asChild>
            <NavLink to="/dashboard">Enter</NavLink>
          </Button>
        </div>
      </AuroraBackground>
    </div>
  );
};

export default Home;
