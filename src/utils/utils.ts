import { compareSync, hashSync } from 'bcrypt';

export type Dictionary<T> = {
  [key: string]: T;
};

export const getRandomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const excludeNull = <T>(array: T[]): T[] => {
  return array.filter((el) => el);
};

export const uniqueArray = <T>(
  array: Array<T>,
  isExcludeNull = true,
): Array<T> => {
  return [...new Set(isExcludeNull ? excludeNull(array) : array)];
};

export const randomElement = <T>(array: Array<T>): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const asyncMap = <T, K>(
  arr: Array<T>,
  fn: (value: T, index?: number, array?: Array<T>) => Promise<K>,
) => {
  const promises = arr.map(fn);
  return Promise.all(promises);
};

export const getBucketCacheKey = (key: string, id: number) => {
  return `${key.toLowerCase()}bucket:${Math.floor(id / 1000)}`;
};

export const generateUniqId = () => {
  return `${new Date().getTime()}`;
};

export const textToSlug = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') //remove diacritics
    .toLowerCase()
    .replace(/\s+/g, '_') //spaces to dashes
    .replace(/&/g, '-and-') //ampersand to and
    .replace(/[^\w\-]+/g, '') //remove non-words
    .replace(/\-\-+/g, '_') //collapse multiple dashes
    .replace(/^-+/, '') //trim starting dash
    .replace(/-+$/, ''); //trim ending dash
};

export const hashPassword = (password: string) => {
  return hashSync(password, 12);
};

export const comparePasswords = (
  password: string,
  storedPasswordHash: string,
) => {
  return compareSync(password, storedPasswordHash);
};

export const genOtp = () => {
  return parseInt(`${1000 + Math.random() * 9000}`).toString();
};

export const makeId = (length: number) => {
  const result = [];
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength)),
    );
  }
  return result.join('');
};

export const mapNumber = (num: string | number = 0): number => {
  const parsedNumber = Number(num || 0);
  if (Number.isNaN(parsedNumber)) {
    return 0;
  }
  return parsedNumber;
};
