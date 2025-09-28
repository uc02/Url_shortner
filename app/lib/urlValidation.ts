function Validation(url: string): boolean {
  if(!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default Validation;