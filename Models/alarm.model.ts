import { Machine } from './machine.model';
import { ErrorType } from './error-type.model';

export interface Alarm {
  alarmId: number;
  machineId: number;
  errorTypeId: number;
  alarmTime: Date; // API'den string olarak gelebilir, date'e çevirmeyi düşünebilirsin
  isResolved: boolean;
  machine?: Machine; // İlişkili Machine nesnesi
  errorType?: ErrorType; // İlişkili ErrorType nesnesi
}