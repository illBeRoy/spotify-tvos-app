import { sleep } from './sleep';

export const eventually = async <T>(predicate: () => T, timeout = 10000): Promise<T> => {
  const startedAt = Date.now();
  while (true) {
    try {
      return await predicate();
    } catch (err) {
      if (Date.now() >= startedAt + timeout) {
        throw err;
      } else {
        await sleep(50);
      }
    }
  }
};
