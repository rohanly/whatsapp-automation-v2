export function getRandomIndex(n: number) {
  if (n === 0) {
    throw new Error("Array cannot be empty");
  }
  return Math.floor(Math.random() * n);
}

export function parseTemplate(template: string, data: any): string {
  return template.replace(/{{(.*?)}}/g, (match, p1) => {
    const key = p1.trim();
    return key in data ? data[key] : match;
  });
}
