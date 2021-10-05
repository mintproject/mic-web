export function replacer(key: string, value: any) {
  if (value === null) {
    return undefined;
  }
  return value;
}