import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { FaAngleDoubleRight } from '@react-icons/all-files/fa/FaAngleDoubleRight';
import { IoLocationOutline } from '@react-icons/all-files/io5/IoLocationOutline';
import { IoPricetagsOutline } from '@react-icons/all-files/io5/IoPricetagsOutline';
import { IoTimeOutline } from '@react-icons/all-files/io5/IoTimeOutline';
import { formatDate } from 'date-fns';
import { useReadContract, useWriteContract } from 'wagmi';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ABI, CONTRACT_ADDRESS } from '@/config';
import type { EventInfo } from '@/types/eventInfo';
import { cn } from '@/utils';

export const EventSheet = NiceModal.create((params: { eventInfo: EventInfo }) => {
  const { eventInfo } = params;
  const { writeContract } = useWriteContract();

  const modal = useModal();

  /** 票价 */
  const ticketPrice = Number(BigInt(eventInfo.ticketPrice).toString());

  /** 购买门票 */
  const onBuyTicket = () => {
    writeContract({
      abi: ABI,
      address: CONTRACT_ADDRESS,
      functionName: 'buyTicket',
      args: [eventInfo.id],
    });
  };

  return (
    <Sheet
      open={modal.visible}
      onOpenChange={(open) => (open ? modal.show() : modal.hide())}
    >
      <SheetContent className={cn('w-[30rem] !max-w-none', 'p-0')}>
        <div className={cn('h-12', 'px-3 py-2', 'flex items-center')}>
          <FaAngleDoubleRight
            className={cn('size-4', 'cursor-pointer', 'text-muted-foreground')}
            onClick={() => {
              modal.hide();
            }}
          />
        </div>

        <SheetHeader className={cn('px-4', 'mb-4')}>
          <div className={cn('flex items-center justify-center')}>
            <img
              className={cn('w-80  object-cover', 'rounded-lg', 'shadow-xl')}
              src={eventInfo.imageSrc}
              alt="event-cover"
            />
          </div>

          <SheetTitle className="text-3xl pt-5">{eventInfo.name}</SheetTitle>
        </SheetHeader>

        <SheetDescription className={cn('px-4', 'text-base text-secondary-foreground')}>
          {/* base Info */}
          <div className={cn('space-y-2')}>
            <div className={cn('flex items-center')}>
              <div className="p-1 border-secondary-foreground/30 border rounded-sm mr-2">
                <IoTimeOutline />
              </div>

              {formatDate(new Date(Number(eventInfo.date)), 'yyyy-MM-dd HH:mm')}
            </div>

            <div className={cn('flex items-center')}>
              <div className="p-1 border-secondary-foreground/30 border rounded-sm mr-2">
                <IoLocationOutline />
              </div>

              {eventInfo.location}
            </div>

            <div className={cn('flex items-center', 'space-x-1')}>
              <div className="p-1 border-secondary-foreground/30 border rounded-sm mr-2">
                <IoPricetagsOutline />
              </div>
              <span>{ticketPrice || 'Free'}</span>
            </div>
          </div>

          <div className="pt-3">
            <h2 className="text-lg border-b pb-2">About Event</h2>
            <div className="pt-3">{eventInfo.description}</div>
          </div>

          <Button className="w-full mt-4" onClick={onBuyTicket}>
            Buy Ticket
          </Button>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
});
