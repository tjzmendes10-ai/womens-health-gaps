// Links from other pages into "What needs to change" on /where-were-headed/.
// Each change card gets an id made from its heading, e.g.
// "Researchers and institutions" -> #researchers-and-institutions.
export const changeId = (who: string) =>
  who.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
