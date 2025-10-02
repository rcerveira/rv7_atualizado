export const maskCPF = (value: string): string => {
  if (!value) return "";
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .slice(0, 14);
};

export const maskCNPJ = (value: string): string => {
  if (!value) return "";
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .slice(0, 18);
};

export const maskPhone = (value: string): string => {
  if (!value) return "";
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d)(\d{4})$/, '$1-$2');
  return value.slice(0, 15);
};

export const formatPhoneNumberForWhatsApp = (phone: string): string => {
  if (!phone) return "";
  const digitsOnly = phone.replace(/\D/g, '');

  // Assuming Brazilian numbers. If it doesn't already start with 55 and has 10 or 11 digits, add 55.
  if (!digitsOnly.startsWith('55') && (digitsOnly.length === 10 || digitsOnly.length === 11)) {
    return '55' + digitsOnly;
  }
  
  return digitsOnly;
};
