export function replacer(key: string, value: any) {
  if (value === null) {
    return undefined;
  }
  return value;
}

export const getIdFromUrl = (id: string) => {
  return id.split('/').slice(-1)[0]
}