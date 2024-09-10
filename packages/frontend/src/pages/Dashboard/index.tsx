import { useState } from 'react';
import { useModal } from '@ebay/nice-modal-react';
import { IoLocationOutline } from '@react-icons/all-files/io5/IoLocationOutline';
import { IoPricetagsOutline } from '@react-icons/all-files/io5/IoPricetagsOutline';
import { IoTimeOutline } from '@react-icons/all-files/io5/IoTimeOutline';
import { formatDate } from 'date-fns';
import { useReadContract } from 'wagmi';

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
import { EventInfo } from '@/types/eventInfo';
import { cn } from '@/utils';

const tabOptions = [
  { label: 'Discover', value: 'discover' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'past' },
] as const;

type TabValues = (typeof tabOptions)[number]['value'];

const Discover = (params: {
  events?: EventInfo[];
  onClick: (event: EventInfo) => void;
}) => {
  const { events = [] } = params ?? {};

  /**  */
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
        <div className={cn('size-48 overflow-hidden', ' p-3', 'shrink-0')}>
          <img
            className={cn('size-full object-cover', 'rounded-lg')}
            src={event.imageSrc ?? '/public/images/default-cover.webp'}
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

          <CardContent className={cn('text-muted-foreground', 'text-base')}>
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

  return (
    <div className={cn('space-y-6')}>
      {events.map((event) => {
        return (
          <DiscoverItem
            key={event.id.toString()}
            event={event}
            onClick={() => params.onClick(event)}
          />
        );
      })}
    </div>
  );
};

/** 控制面板 */
const Dashboard = () => {
  const [tab, setTab] = useState<TabValues>('discover');

  const { data: events = [] } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getAllEvents',
  });
  console.log('🚀 ~ Dashboard ~ events:', events);

  const eventSheet = useModal(EventSheet);

  const TabsWrap = (params: {
    tab: TabValues;
    className?: string;
    defaultValue?: TabValues;
    onValueChange: (value: string) => void;
  }) => {
    const { defaultValue = 'discover', onValueChange, className } = params;

    return (
      <Tabs
        className={className}
        defaultValue={defaultValue}
        value={tab}
        onValueChange={onValueChange}
      >
        <TabsList className="grid grid-cols-3">
          {tabOptions.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  };

  return (
    <div className={cn('w-full', 'h-min-full')}>
      <div className={cn('w-6xl h-screen', 'm-auto')}>
        <div className={cn('flex items-center justify-between', 'pt-6 pb-16')}>
          <div className={cn('text-3xl font-bold')}>Events</div>
          <div>
            <TabsWrap tab={tab} onValueChange={(value) => setTab(value as TabValues)} />
          </div>
        </div>
        <div>
          {tab === 'discover' && (
            <Discover
              events={events as EventInfo[]}
              onClick={(eventInfo) => {
                eventSheet.show({ eventInfo });
              }}
            />
          )}
          {tab === 'upcoming' && <div>Upcoming</div>}
          {tab === 'past' && <div>Past</div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
