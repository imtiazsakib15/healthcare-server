export const pick = (obj: Record<string, unknown>, keys: string[]) => {
  const filteredKeys = Object.keys(obj).filter((key) => keys.includes(key));

  const filteredObj = filteredKeys.reduce(
    (acc: Record<string, unknown>, key: string) => {
      acc[key] = obj[key];
      return acc;
    },
    {}
  );
  return filteredObj;
};
