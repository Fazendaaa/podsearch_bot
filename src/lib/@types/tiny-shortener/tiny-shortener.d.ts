/**
 * This  typing  file  allows  to define the tiny function as a type, this way it can be passed through a function as an
 * parameter in a high order function letting the TypeScript compiler check if matches or not. As so the function itself
 * must be defined to allow the user to work with it.
 */
export type tiny = (url: string) => Promise<string>;
export function tiny (url: string): Promise<string>;
 