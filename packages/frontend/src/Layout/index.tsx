import { Outlet } from 'react-router';
import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { cn } from '@/utils';
import Logo from '/logo.svg?react';

const Layout = () => {
  const LinkWrap = (props: LinkProps) => {
    const { to, children } = props;
    return (
      <Link
        className={cn(
          'text-muted-foreground hover:text-foreground',
          'transition-all duration-500',
        )}
        to={to}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className={cn('h-min-screen w-screen')}>
      <header className={cn('h-16 w-full', 'sticky top-0', 'bg-background')}>
        <div className={cn('flex items-center justify-between', 'h-full', 'mx-6')}>
          {/* logo */}
          <div>
            <Logo className={cn('size-6')} />
          </div>

          {/* header main */}
          <div
            className={cn(
              'w-[calc(64rem+(100%-64rem)/2)]',
              'flex items-center justify-between',
            )}
          >
            <div className={cn('flex', 'space-x-4')}>
              <LinkWrap to="/dashboard">Dashboard</LinkWrap>
            </div>

            <div className={cn('flex', 'space-x-4')}>
              <div>{new Date().toLocaleDateString()}</div>

              <LinkWrap
                className={cn(
                  'text-muted-foreground hover:text-foreground',
                  'transition-all duration-500',
                )}
                to="/create"
              >
                Create Event
              </LinkWrap>

              <div>用户</div>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default Layout;
