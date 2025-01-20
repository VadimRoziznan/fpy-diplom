export const validatePassword = (password) => {
  const regex = /(?=.*[0-9])(?=.*[!@#$%^&*></?}~`'"-+,.:;])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g;
  return regex.test(password);
};

export const validateLogin = (password) => {
  const regex = /^[A-Z][0-9a-zA-Z]{3,19}$/;
  return regex.test(password);
};