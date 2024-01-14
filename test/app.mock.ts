import { APIGatewayProxyEventV2 } from "aws-lambda";
import { PersonEntity } from "../src/entities/person.entity";

export const createPersonEntityMock = (): PersonEntity => ({
	firstName: "Dmitry",
	lastName: "Tuzenkov",
	phone: "020000001",
	address: {
		city: "Amsterdam",
		country: "Netherlands",
		houseNumber: "2-1020",
		postCode: "1083HJ",
		street: "De Boolelaan",
	},
});

export const createPostPersonProxyEventMock = (): APIGatewayProxyEventV2 => {
	const body = JSON.stringify(createPersonEntityMock());
	return {
		requestContext: {
			http: {
				method: "POST",
			},
		},
		rawPath: "/persons",
		rawQueryString: "",
		body,
	} as APIGatewayProxyEventV2;
};

export const createGetAllPersonsListProxyEventMock =
	(): APIGatewayProxyEventV2 => {
		return {
			requestContext: {
				http: {
					method: "GET",
				},
			},
			rawPath: "/persons",
			rawQueryString: "",
			body: "",
		} as APIGatewayProxyEventV2;
	};

export const createUnknownProxyEventMock = (): APIGatewayProxyEventV2 => {
	return {
		requestContext: {
			http: {
				method: "GET",
			},
		},
		rawPath: "/unknown",
		rawQueryString: "",
		body: "",
	} as APIGatewayProxyEventV2;
};
