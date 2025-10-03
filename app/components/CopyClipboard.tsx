export const copyToclipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('copied the shortURL')
    return true;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    return false
  }
}