import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ErrorHandlingPipes implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (value.name) {
      value.name = value.name.toLowerCase();
    }
    return value;
  }
}
