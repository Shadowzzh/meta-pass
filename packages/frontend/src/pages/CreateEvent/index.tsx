import { useEffect } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ABI, CONTRACT_ADDRESS } from '@/config';
import type { FormSchema } from '@/pages/CreateEvent/EventForm';
import { EventForm } from '@/pages/CreateEvent/EventForm';
import { cn } from '@/utils';

/**
 * 创建活动页面
 */
const CreateEvent = () => {
  const { toast } = useToast();

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    toast({
      title: 'create event',
      description: 'preparing to create event...',
    });

    try {
      await writeContract({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'createEvent',
        args: [
          formData.eventName,
          formData.startDate.valueOf(),
          formData.location,
          formData.capacity,
          formData.tickets,
        ],
      });

      toast({
        title: 'Transaction Submitted',
        description: 'Waiting for blockchain confirmation...',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Transaction Failed',
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } else if (isConfirming) {
      toast({
        title: 'Confirming',
        description: 'Transaction is being confirmed...',
      });
    } else if (isSuccess) {
      toast({
        title: 'Success',
        description: 'Event created successfully!',
      });
    }
  }, [error, isConfirming, isSuccess, toast]);

  return (
    <div className={cn('w-full', 'min-h-[calc(100vh-4rem)]')}>
      <div className={cn('w-6xl', 'm-auto', 'flex justify-between', 'pt-6')}>
        <div
          className={cn(
            'size-80',
            'rounded-2xl',
            'overflow-hidden',
            'border-2 border-gray300',
            ' shrink-0 ',
            'mr-8',
          )}
        >
          <img
            className={cn('w-full h-full', 'object-cover')}
            src="/public/image/bg-1.jpg"
            alt="bg"
          />
        </div>

        <div className={cn('w-full pt-2')}>
          <EventForm
            onSubmit={onSubmit}
            Button={
              <Button className={cn('mt-4')} type="submit">
                {(isPending || isConfirming) && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
