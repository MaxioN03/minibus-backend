import {DATE_SEPARATOR} from "./constants";

export const getDateFromRu = (ruDateString: string) => {
    let splitDate = ruDateString?.split(DATE_SEPARATOR);
    if (splitDate?.length !== 3) {
        return null;
    }

    let [day, month, year] = splitDate;
    return new Date([month, day, year].join(DATE_SEPARATOR));
};

const wait = (interval: number) => new Promise(resolve => setTimeout(resolve, interval));
export const asyncRetry = async <T>(fn: any, retriesLeft = 5, interval = 200): Promise<any> => {
    try {
        return await fn();
    } catch (error) {
        await wait(interval);
        if (retriesLeft === 0) {
            throw new Error(error);
        }
        return await asyncRetry(fn, --retriesLeft, interval);
    }
};