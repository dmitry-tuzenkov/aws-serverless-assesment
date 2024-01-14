import { PersonEntity } from './person.entity';

export interface PersonListEntity {
  skip: number;
  count: number;
  data: PersonEntity[];
}

export const createPersonListEntity = (payload?: PersonListEntity) =>
  Object.assign({ skip: 0, count: 0, data: [] }, payload);
