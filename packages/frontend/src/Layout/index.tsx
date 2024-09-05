import { useEffect, useState } from 'react';
import { ConnectKitButton } from 'connectkit';
import { format } from 'date-fns';
import { Outlet, useLocation } from 'react-router';
import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { cn } from '@/utils';
import Logo from '/logo.svg?react';

/** 当前时间 */
const Timer = (params: { children: (params: { time: Date }) => React.ReactNode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return params.children({ time });
};

const Layout = () => {
  /** 链接 */
  const LinkWrap = (props: LinkProps) => {
    const { to, children, className } = props;
    const { pathname } = useLocation();

    //  是否是当前路由
    const isCurrentRoute = pathname === to;

    return (
      <Link
        className={cn(
          'text-secondary-foreground/50 hover:text-accent-foreground text-sm',
          'transition-all duration-500',
          'noselect-none',
          isCurrentRoute && 'text-accent-foreground',
          className,
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

            <div className={cn('flex items-center', 'space-x-4')}>
              <Timer>
                {({ time }) => (
                  <div className="text-sm text-muted-foreground/50 w-36 mt-[0.1">
                    {format(time, 'yyyy-MM-dd HH:mm')}
                  </div>
                )}
              </Timer>

              <LinkWrap className={cn('font-bold')} to="/create">
                Create Event
              </LinkWrap>

              <div className="ml-3 flex justify-end">
                <ConnectKitButton label="Connect Wallet" />
              </div>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default Layout;
