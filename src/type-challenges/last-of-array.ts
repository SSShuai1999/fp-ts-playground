type Last<T extends any[]> = T extends [...infer _never, infer R] ? R : T;

const LastOfArray: Last<[1, 2, 3, 4]> = 4;
