export {};

declare global {
  namespace BaseResponse {
    export type List<T> = {
      total: number;
      items: T[];
    };
  }

  declare interface Class {
    new (...arg): InstanceType;
  }

  export type DateString = Date | string;
}
