import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils';

interface EventFormProps {
  className?: string;
  onSubmit: (values: z.infer<typeof FormSchema>) => void;
  Button: React.ReactNode;
}

/** 表单验证 */
export const FormSchema = z.object({
  /** 事件名称 */
  eventName: z.string().min(1, {
    message: 'Event name must be at least 1 character.',
  }),
  /** 开始日期 */
  startDate: z.date(),
  /** 地点 */
  location: z.string().min(1, {
    message: 'Location must be at least 1 character.',
  }),
  /** 票价 */
  tickets: z.number().min(0, {
    message: 'Ticket price must be at least 0.',
  }),
  /** 总票数 */
  capacity: z.number().min(1, {
    message: 'Capacity must be at least 1.',
  }),
});

/** 开发环境默认值 */
const DevDefaultValues = {
  eventName: 'web3 开发者大会',
  startDate: new Date('2025-05-01'),
  location: '上海',
  capacity: 100,
  tickets: 0,
};

const defaultValues = {
  eventName: '',
  startDate: new Date(),
  endDate: new Date(),
  location: '',
  capacity: 1,
  tickets: 0,
};

/** 创建事件表单 */
const EventForm = (props: EventFormProps) => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    // 开发环境使用默认值
    defaultValues:
      import.meta.env.MODE === 'development' ? DevDefaultValues : defaultValues,
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    props.onSubmit(values);
  };

  return (
    <Form {...form}>
      <form className={cn(props.className)} onSubmit={form.handleSubmit(onSubmit)}>
        {/* 事件名称 */}
        <FormItem>
          <FormField
            control={form.control}
            name="eventName"
            render={({ field }) => (
              <FormControl>
                <Textarea
                  placeholder="Event Name"
                  className={cn(
                    'resize-none',
                    'text-2xl',
                    '!border-none !ring-0 p-0',
                    '!min-h-0',
                  )}
                  {...field}
                />
              </FormControl>
            )}
          />
          <FormMessage>{form.formState.errors.eventName?.message}</FormMessage>
        </FormItem>

        <div className={cn('flex items-start mt-4 space-x-4')}>
          {/* 开始日期 */}
          <FormItem className={cn('flex flex-col flex-1')}>
            <FormLabel>Event Date</FormLabel>

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => {
                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a startdate</span>
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <FormControl>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </FormControl>
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
            <FormMessage>{form.formState.errors.startDate?.message}</FormMessage>
          </FormItem>

          {/* 地点 */}
          <FormItem className={cn('flex flex-col flex-1')}>
            <FormLabel>Location</FormLabel>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => {
                return (
                  <FormControl>
                    <Input placeholder="Event Location" {...field} />
                  </FormControl>
                );
              }}
            />
            <FormMessage>{form.formState.errors.location?.message}</FormMessage>
          </FormItem>
        </div>

        <div className={cn('flex items-start mt-4 space-x-4')}>
          {/* 票价 */}
          <FormItem className={cn('flex flex-col flex-1')}>
            <FormLabel> Ticket</FormLabel>
            <FormField
              control={form.control}
              name="tickets"
              render={({ field }) => {
                return (
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ticket Price"
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>
                );
              }}
            />
            <FormDescription>If it is 0, the ticket is free</FormDescription>
            <FormMessage>{form.formState.errors.tickets?.message}</FormMessage>
          </FormItem>

          {/* 总票数 */}
          <FormItem className={cn('flex flex-col flex-1')}>
            <FormLabel>Capacity</FormLabel>
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => {
                return (
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Total Tickets"
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>
                );
              }}
            />
            <FormMessage>{form.formState.errors.capacity?.message}</FormMessage>
          </FormItem>
        </div>

        {props.Button}
      </form>
    </Form>
  );
};

export { EventForm };
