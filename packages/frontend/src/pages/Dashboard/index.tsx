import { useMemo, useState } from 'react';
import { useModal } from '@ebay/nice-modal-react';
import { IoLocationOutline } from '@react-icons/all-files/io5/IoLocationOutline';
import { IoLogoDropbox } from '@react-icons/all-files/io5/IoLogoDropbox';
import { IoPricetagsOutline } from '@react-icons/all-files/io5/IoPricetagsOutline';
import { IoTimeOutline } from '@react-icons/all-files/io5/IoTimeOutline';
import { formatDate } from 'date-fns';
import { useAccount, useReadContract } from 'wagmi';

import { EventSheet } from './EventSheet';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ABI, CONTRACT_ADDRESS } from '@/config';
import { EventInfo, TicketInfo } from '@/types/eventInfo';
import { cn } from '@/utils';
import { getAssetPath } from '@/utils/env';

const tabOptions = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Registered', value: 'Registered' },
] as const;

type TabValues = (typeof tabOptions)[number]['value'];

const Discover = (params: {
  events?: EventInfo[];
  onClick?: (event: EventInfo) => void;
}) => {
  const { events = [] } = params ?? {};

  /** 发现项目 */
  const DiscoverItem = (params: { event: EventInfo; onClick: () => void }) => {
    const { event, onClick } = params;

    /** 票价 */
    const ticketPrice = Number(BigInt(event.ticketPrice).toString());

    return (
      <Card
        className={cn('flex', 'items-center', 'bg-background/20', 'cursor-pointer')}
        key={event.date}
        onClick={() => onClick()}
      >
        <div className={cn('size-[10.5rem] overflow-hidden', ' p-3', 'shrink-0')}>
          <img
            className={cn('size-full object-cover', 'rounded-lg')}
            src={getAssetPath(event.imageSrc ?? '/images/default-cover.webp')}
            alt="event-cover"
          />
        </div>
        <div>
          <CardHeader>
            <CardTitle className={cn('text-xl')}>{event.name}</CardTitle>
            <CardDescription className={cn('line-clamp-2')} title={event.description}>
              {event.description}
            </CardDescription>
          </CardHeader>

          <CardContent
            className={cn('text-muted-foreground', 'text-base', 'flex', 'space-x-4')}
          >
            <div className={cn('flex items-center', 'space-x-1')}>
              <IoTimeOutline />
              <span>{formatDate(new Date(Number(event.date)), 'yyyy-MM-dd HH:mm')}</span>
            </div>
            <div className={cn('flex items-center', 'space-x-1')}>
              <IoLocationOutline />
              <span>{event.location}</span>
            </div>
            <div className={cn('flex items-center', 'space-x-1')}>
              <IoPricetagsOutline />
              <span>{ticketPrice || 'Free'}</span>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  /** 没有事件 Empty */
  if (events.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center', 'h-full', 'mt-20')}>
        <IoLogoDropbox className={cn('text-muted-foreground', 'md:size-44 size-28')} />
        <div className={cn('text-muted-foreground', 'text-center', 'text-lg', 'mt-4')}>
          No events found
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6')}>
      {events.map((event) => {
        return (
          <DiscoverItem
            key={event.id.toString()}
            event={event}
            onClick={() => params.onClick?.(event)}
          />
        );
      })}
    </div>
  );
};

const TabsWrap = (params: {
  tab: TabValues;
  className?: string;
  defaultValue?: TabValues;
  onValueChange: (value: string) => void;
}) => {
  const { defaultValue = 'upcoming', onValueChange, className, tab } = params;

  return (
    <Tabs
      className={className}
      defaultValue={defaultValue}
      value={tab}
      onValueChange={onValueChange}
    >
      <TabsList className="grid grid-cols-2">
        {tabOptions.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

/** 控制面板 */
const Dashboard = () => {
  const [tab, setTab] = useState<TabValues>('upcoming');

  const { address } = useAccount();

  /** 所有事件 */
  const { data: events = [] } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getAllEvents',
  });

  /** 用户拥有的票 */
  const userTicket = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getUserTickets',
    args: [address],
  });

  const userTicketData = (userTicket.data as TicketInfo[]) || [];

  const eventSheet = useModal(EventSheet);

  /** 即将到来的项目 */
  const upcomingEvents = useMemo(() => {
    return (events as EventInfo[]).filter((event) =>
      userTicketData.every((ticket) => ticket.eventId.toString() !== event.id.toString()),
    );
  }, [events, userTicketData]);

  /** 已注册的项目 */
  const registeredEvents = useMemo(() => {
    return (events as EventInfo[]).filter((event) =>
      userTicketData.some((ticket) => ticket.eventId.toString() === event.id.toString()),
    );
  }, [events, userTicketData]);

  return (
    <div className={cn('w-full', 'h-min-full')}>
      <div className={cn('max-w-5xl h-screen', 'm-auto')}>
        <div className={cn('flex items-center justify-between', 'pt-6 pb-16')}>
          <div className={cn('md:text-3xl text-xl font-bold')}>Events</div>
          <div>
            <TabsWrap tab={tab} onValueChange={(value) => setTab(value as TabValues)} />
          </div>
        </div>
        <div>
          {tab === 'upcoming' && (
            <Discover
              events={upcomingEvents}
              onClick={(eventInfo) => {
                eventSheet.show({
                  eventInfo,
                  onSuccess: () => {
                    userTicket.refetch();
                  },
                });
              }}
            />
          )}
          {tab === 'Registered' && <Discover events={registeredEvents} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
