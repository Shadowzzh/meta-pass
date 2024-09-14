import { useState } from 'react';
import { useModal } from '@ebay/nice-modal-react';
import { ImageIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { GalleryModal } from '@/pages/CreateEvent/modals/GalleryModal';
import { cn } from '@/utils';
import { getAssetPath } from '@/utils/env';

interface PickerImageProps {
  onChange?: (image: string) => void;
  className?: string;
  imageSrc?: string;
}

/** 图片选择器 */
export const PickerImage = (props: PickerImageProps) => {
  const [image, setImage] = useState<string>(getAssetPath('/images/default-cover.webp'));

  const onChoose = (image: string) => {
    setImage(image);
    props.onChange?.(image);
  };

  const galleryModal = useModal(GalleryModal);

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'size-[22rem]',
        'rounded-2xl',
        'border-2 border-gray300',
        'shrink-0 ',
        'mr-8',
        'cursor-pointer',
        props.className,
      )}
      onClick={() => galleryModal.show({ onChoose })}
    >
      <img className={cn('w-full h-full', 'object-cover')} src={image} alt="bg" />

      <Button
        className={cn(
          'absolute rounded-full bottom-2 right-2 border-2 border-neutral-200',
          'bg-neutral-800/50 hover:bg-neutral-500/50',
        )}
        variant="outline"
        size="icon"
        onClick={() => galleryModal.show({ onChoose })}
      >
        <ImageIcon className="text-neutral-100" />
      </Button>
    </div>
  );
};
