export const bodyJsonParser = <T>(rawBody: string) => {
  try {
    return JSON.parse(rawBody) as T;
  } catch (ex: unknown) {
    throw new Error('failed to json parse raw body');
  }
};
