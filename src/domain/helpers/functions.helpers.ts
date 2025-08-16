import { v4 as uuidv4 } from "uuid";

export const generateUuid = (): string => {
  return uuidv4();
};

export const hasInformation = (data?: string): boolean => {
  if (data === undefined || data.trim() === "") {
    return false;
  }
  return true;
};

export const isValidEnumItem = <T extends object>(
  enumObject: T,
  value: unknown
): value is T[keyof T] => {
  const allEnumValues = Object.values(enumObject);

  if (allEnumValues.some((v) => typeof v === "number")) {
    if (typeof value === "number") {
      return allEnumValues.includes(value);
    }
  } else {
    return allEnumValues.includes(value as T[keyof T]);
  }

  return false;
};

export const isEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
