type Pop<T extends any[]> = T extends [...infer R, infer _placeholders]
  ? R
  : never;

const PopTest: Pop<[1, 2, 3, 4]> = [1, 2, 3];
