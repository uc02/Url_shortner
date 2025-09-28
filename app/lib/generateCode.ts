const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CODE_LENGTH = 6;

export function generateUniqueShortCode(): string {
  let result = ''
  for(let i = 0; i < CODE_LENGTH; i++){
    result += BASE62[Math.floor(Math.random() * BASE62.length)]
  }
  return result;
}