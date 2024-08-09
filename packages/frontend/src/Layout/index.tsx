import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';

import { cn } from '@/utils';

const Layout = () => {
  return (
    <div className={cn('h-screen w-screen')}>
      <header className={cn('h-14')}>
        <div className={cn('flex items-center justify-between', 'h-full', 'mx-6')}>
          <div>logo</div>
          <div className={cn('flex', 'space-x-4')}>
            <div>{new Date().toLocaleDateString()}</div>

            <Link
              className={cn(
                'text-muted-foreground hover:text-foreground',
                'transition-all duration-500',
              )}
              to="/event"
            >
              Create Event
            </Link>

            <div>用户</div>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default Layout;
