import { format, parse } from 'date-fns';

export function formatTime(timeString: string): string {
   const parsedTime = parse(timeString, 'HH:mm', new Date());
   return format(parsedTime, 'hh:mm a');
}
