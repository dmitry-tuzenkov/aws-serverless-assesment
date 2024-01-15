import {
  PersonEntity,
  createAndValidatePersonEntityData,
} from '../entities/person.entity';

export interface CreatePersonEntityDto extends PersonEntity {}

export const createPersonEntityDto = async (
  data: PersonEntity,
): Promise<CreatePersonEntityDto> => {
  const personEntity = await createAndValidatePersonEntityData(data);
  return personEntity;
};
