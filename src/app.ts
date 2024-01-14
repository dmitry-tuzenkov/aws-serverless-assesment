import { createPeopleAction } from "./actions/create-people.action";
import {
	App,
	AppEvent,
	AppOptions,
	AppService,
	AppServiceRecord,
} from "./app-types";
import { AppEventPersonCreated } from "./entities/person-event.entity";
import { PersonEntity } from "./entities/person.entity";
import { createMemoryProvider } from "./providers/memory.provider";
import {
	INMEMORY_EVENTS_SERVICE,
	createInMemoryEventsService,
} from "./services/events.service";
import {
	INMEMORY_PEOPLE_SERVICE,
	createInMemoryPeopleService,
} from "./services/people.service";

export const createApp = async (options: AppOptions): Promise<App> => {
	const services: Map<string, AppService<AppServiceRecord>> = new Map();

	// options.dynamoTable
	services.set(
		INMEMORY_PEOPLE_SERVICE,
		await createInMemoryPeopleService(
			await createMemoryProvider<PersonEntity>()
		)
	);

	// options.snsTopic
	services.set(
		INMEMORY_EVENTS_SERVICE,
		await createInMemoryEventsService<AppEventPersonCreated>()
	);

	const handlePersonCreationEvent = createPeopleAction({ services });
	const handleGetAllPersonsListEvent = createPeopleAction({ services });

	return {
		services,
		handlePersonCreationEvent,
		handleGetAllPersonsListEvent,
	};
};
