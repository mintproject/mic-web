export const getIdFromUrl = (id: string) => {
  return id.split('/').slice(-1)[0]
}

export function replacer(key: string, value: any) {
  console.log(value);
  if (key === "inputs" || key === "parameters" || key === "outputs" || value === null) {
    return undefined;
  }
  return value;
}