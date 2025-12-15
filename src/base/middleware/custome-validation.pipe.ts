import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  async transform(value: { filter: any; elasticSearch: any }, metadata: ArgumentMetadata) {
    if (metadata.type === 'query' && typeof value?.filter === 'string')
      try {
        value.filter = JSON.parse(value?.filter);
      } catch (e) {
        /* empty */
      }

    const { metatype } = metadata;
    if (!metatype) {
      return value;
    }

    return super.transform(value, metadata);
  }
}
