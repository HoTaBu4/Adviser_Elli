const maskEmail = (email: string) => {
  const [localPart, domain] = email.split('@');
  const halfLength = Math.floor(localPart.length / 2);
  const maskedLocalPart = '*'.repeat(halfLength) + localPart.slice(halfLength);
  return `${maskedLocalPart}@${domain}`;
};

export default maskEmail