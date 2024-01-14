import { AppDataProvider, AppService, AppServiceRecord } from "../app-types";

export const INMEMORY_PEOPLE_SERVICE = "in_memory_people_service";

export const createInMemoryPeopleService = async (
	dataProvider: AppDataProvider<object>
): Promise<AppService<AppServiceRecord>> => {
	const create = async (data: object) => {
		return {} as AppServiceRecord;
	};

	const findAll = async () => {
		return [] as AppServiceRecord[];
	};

	return { create, findAll };
};
