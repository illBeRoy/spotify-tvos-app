import { sleep } from './sleep';

export const until = async (predicate: () => boolean | Promise<boolean>, timeout = 10000): Promise<void> => {
  const startedAt = Date.now();
  while (Date.now() < startedAt + timeout) {
    if (await predicate()) {
      return;
    }
    await sleep(50);
  }
  throw new Error(`Condition was not fulfilled in ${timeout} ms`);
};
