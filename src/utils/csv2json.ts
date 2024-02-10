export default function csv2json (csv: string, keys: string[], separator: string): any[] {
  const lines = csv.split("\n")
  let baseArray = []

  for (const line of lines) {
    const entries = line.split(separator)

    const object: any = {};

    if (entries.length !== keys.length) continue

    for (let i = 0; i < keys.length; i++) {
      object[keys[i]] = entries[i];
    }
    baseArray.push(object)
  }

  return baseArray
}