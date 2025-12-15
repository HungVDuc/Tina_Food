import { Transform } from 'class-transformer';

export function TransformSort(sortFields?: string[]) {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    const keys = value.replace(/ /g, '').split(',');
    return keys.reduce((acc, cur) => {
      const key = cur.replace(/^[+-]/, '');

      if (Array.isArray(sortFields) && !sortFields.includes(key)) return acc;

      acc[key] = RegExp(/^-/).exec(cur) ? -1 : 1;
      return acc;
    }, {});
  });
}
