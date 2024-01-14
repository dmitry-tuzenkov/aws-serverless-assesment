import { AppService } from "../app-types";

export const INMEMORY_EVENTS_SERVICE = "in_memory_events_service";

export const createInMemoryEventsService = async <T>(): Promise<
	AppService<T>
> => {
	const create = async (data: T) => data;

	const findAll = async () => {
		return [] as T[];
	};

	return { create, findAll };
};
