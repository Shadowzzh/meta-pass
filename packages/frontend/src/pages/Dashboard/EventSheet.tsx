import { useEffect } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { FaAngleDoubleRight } from '@react-icons/all-files/fa/FaAngleDoubleRight';
import { IoLocationOutline } from '@react-icons/all-files/io5/IoLocationOutline';
import { IoPricetagsOutline } from '@react-icons/all-files/io5/IoPricetagsOutline';
import { IoTimeOutline } from '@react-icons/all-files/io5/IoTimeOutline';
import { formatDate } from 'date-fns';
import { toast } from 'sonner';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

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

interface EventSheetProps {
  /** 活动信息 */
  eventInfo: EventInfo;
  /** 购买成功回调 */
  onSuccess?: () => void;
}

export const EventSheet = NiceModal.create((params: EventSheetProps) => {
  const { eventInfo, onSuccess } = params;
  const { writeContract, data: hash, isPending } = useWriteContract();

  const modal = useModal();

  /** 交易状态 */
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

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

    toast('Transaction Submitted', {
      description: 'Waiting for blockchain confirmation...', // 等待区块链确认
    });
  };

  useEffect(() => {
    if (isConfirming) {
      toast('Confirming', {
        description: 'Transaction is being confirmed...', // 交易正在确认中
      });
    } else if (isSuccess) {
      toast('Success', {
        description: 'Transaction confirmed successfully!', // 交易确认成功
      });
      onSuccess?.();
    }
  }, [isConfirming, isSuccess]);

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

        <div className={cn('px-4', 'text-base text-secondary-foreground')}>
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
            <div className="text-lg border-b pb-2">About Event</div>
            <SheetDescription className="pt-3">{eventInfo.description}</SheetDescription>
          </div>

          <Button
            disabled={isPending || isConfirming}
            className="w-full mt-4"
            onClick={onBuyTicket}
          >
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Buy Ticket
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
});
