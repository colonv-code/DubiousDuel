export function nameToImageUri(name: string) {
  const lowercase = name.trim().toLocaleLowerCase();
  return `https://img.pokemondb.net/sprites/home/normal/${lowercase}.png`;
}
