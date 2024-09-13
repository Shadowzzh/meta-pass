import { useEffect, useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { IoCheckmarkCircle } from '@react-icons/all-files/io5/IoCheckmarkCircle';
import { useModal } from 'connectkit';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import type { z } from 'zod';

import { PickerImage } from './components/PickerImage';
import { Button } from '@/components/ui/button';
import { ABI, CONTRACT_ADDRESS } from '@/config';
import type { FormSchema } from '@/pages/CreateEvent/EventForm';
import { EventForm } from '@/pages/CreateEvent/EventForm';
import { cn } from '@/utils';

/**
 * 创建活动页面
 */
const CreateEvent = () => {
  const navigate = useNavigate();

  /** 图片 */
  const [image, setImage] = useState<string>('/images/default-cover.webp');
  /** 连接状态 */
  const { isConnected } = useAccount();
  /** 设置弹窗状态 */
  const { setOpen } = useModal();
  /** 交易状态 */
  const {
    writeContract,
    data: hash,
    isPending,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast('Transaction Submitted', {
          description: 'Waiting for blockchain confirmation...', // 等待区块链确认
        });
      },
      onError: (error) => {
        toast('Error', {
          description: (error as any).details,
        });
      },
    },
  });

  /** 交易状态 */
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  /** 图片改变 */
  const onImageChange = (image: string) => {
    setImage(image);
  };

  /** 提交 */
  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    if (!isConnected) {
      setOpen(true);
      return;
    }

    await writeContract({
      abi: ABI,
      address: CONTRACT_ADDRESS,
      functionName: 'createEvent',
      args: [
        formData.eventName,
        formData.location,
        formData.description,
        image,
        formData.startDate.valueOf(),
        formData.capacity,
        formData.tickets,
      ],
    });

    toast('Transaction Submitted', {
      description: 'Waiting for blockchain confirmation...', // 等待区块链确认
    });
  };

  /** 交易状态 */
  useEffect(() => {
    if (isConfirming) {
      toast('Confirming', {
        description: 'Transaction is being confirmed...', // 交易正在确认中
      });
    } else if (isSuccess) {
      toast('Transaction Confirmed', {
        description: 'Transaction has been confirmed.', // 交易已确认
        icon: <IoCheckmarkCircle className="size-4 text-green-500" />,
      });
      navigate('/dashboard');
    }
  }, [isConfirming, isSuccess]);

  return (
    <div className={cn('w-full', 'min-h-[calc(100vh-4rem)]')}>
      <div className={cn('w-6xl', 'm-auto', 'flex justify-between', 'pt-6')}>
        {/* 图片选择器 */}
        <PickerImage onChange={onImageChange} imageSrc={image} />

        <div className={cn('w-full pt-2')}>
          {/* 表单 */}
          <EventForm
            onSubmit={onSubmit}
            Button={
              <Button className={cn('mt-8')} type="submit">
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
