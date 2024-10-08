import { type ReactNode } from 'react';
import { create, useModal } from '@ebay/nice-modal-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/utils';
import { getAssetPath } from '@/utils/env';

interface GalleryModalProps {
  trigger: ReactNode;
  triggerClassName?: string;
  className?: string;
  /** 选择图片 */
  onChoose: (imageName: string) => void;
}

const imageNames = ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5', 'bg-6'];

/** 图片选择器 */
export const GalleryModal = create((props: GalleryModalProps) => {
  const modal = useModal();

  /** 全路径 */
  const fullUrl = (imageName: string) => getAssetPath(`/images/${imageName}.webp`);

  /** 选择图片 */
  const onChoose = (imageName: string) => {
    const imageUrl = fullUrl(imageName);
    props.onChoose(imageUrl);
    modal.hide();
  };

  return (
    <Dialog open={modal.visible} onOpenChange={modal.hide}>
      <DialogContent className={cn(props.className, 'md:max-w-2xl w-[90vw] md:rounded-xl rounded-sm')}>
        <DialogHeader>
          <DialogTitle className="text-center">选择图片</DialogTitle>
          <DialogDescription>选择一张图片作为活动封面。</DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            'grid md:grid-cols-3 grid-cols-2 md:gap-2 gap-1',
            ' h-[40vh] overflow-y-auto',
          )}
        >
          {imageNames.map((imageName) => {
            return (
              <img
                className={cn(
                  'block size-52 ',
                  'object-cover rounded-sm',
                  'cursor-pointer',
                  'hover:scale-105 transition-all ease-in-out duration-500',
                )}
                src={fullUrl(imageName)}
                alt={imageName}
                key={imageName}
                onClick={() => onChoose(imageName)}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
});
