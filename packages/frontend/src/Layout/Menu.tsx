'use client';

import * as React from 'react';

import 'connectkit';

import { useModal } from 'connectkit';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutMenuProps {
  children: (params: { address: `0x${string}` | undefined }) => React.ReactNode;
}

export const LayoutMenu = (props: LayoutMenuProps) => {
  const { address } = useAccount();
  const { openProfile, setOpen } = useModal();

  if (!address)
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        login
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={'icon'} className="rounded-full cursor-pointer">
          {props.children?.({ address })}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent collisionPadding={{ right: 10 }}>
        <DropdownMenuItem onClick={() => openProfile()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
