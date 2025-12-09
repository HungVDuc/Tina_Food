import _ from 'lodash';

// Mongo
export function unidecode(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export const slugify = (str: string) => _.snakeCase(unidecode(str.trim().toLowerCase()));
export const safeRegex = (str: string) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
export const plainText = (val: string): string =>
  unidecode(val.toString().replace(/\s+/g, ' ').trim().toLowerCase());
