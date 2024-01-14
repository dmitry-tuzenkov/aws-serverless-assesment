import { object, string } from "yup";

// A person has first name, last name, phone number and address information.

export interface AddressEntity {
	street: string;
	houseNumber: string;
	postCode: string;
	city: string;
	country: string;
}

export interface PersonEntity {
	firstName: string;
	lastName: string;
	phone: string;
	address: AddressEntity;
}

const personValidationSchema = object({
	firstName: string().trim().required(),
	lastName: string().trim().required(),
	phone: string().trim().required(),
	address: object({
		street: string().trim().required(),
		houseNumber: string().trim().required(),
		postCode: string().trim().required(),
		city: string().trim().required(),
		country: string().trim().required(),
	}),
});

export const createAndValidatePersonEntityData = (
	json: object
): Promise<PersonEntity> => {
	return personValidationSchema.validate(json);
};
