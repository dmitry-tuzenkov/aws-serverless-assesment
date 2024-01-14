export const bodyJsonParser = (rawBody: string) => {
  try {
    return JSON.parse(rawBody);
  } catch (ex: unknown) {
    throw new Error('failed to json parse raw body');
  }
};
