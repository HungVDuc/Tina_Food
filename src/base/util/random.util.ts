export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const rd = () => {
  let rd = random(65, 122);
  if (90 < rd && rd < 97) rd += 10;
  return rd;
};

export const randomAlphabet = (stringLength: number) => {
  let randomString = '';
  while (stringLength--) randomString += String.fromCharCode(rd());
  return randomString;
};
