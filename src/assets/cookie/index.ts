export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function setCookie(cookieName: string, data: any, maxAge: number = 0): void {
  const serializedData = JSON.stringify(data); // Convert data to JSON string
  const expires = maxAge
    ? `; max-age=${maxAge}` // Set max-age if provided
    : "";
  document.cookie = `${cookieName}=${encodeURIComponent(
    serializedData
  )}${expires}; path=/;`;
}

