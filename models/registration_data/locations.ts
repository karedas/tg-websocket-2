export const locations = {
  uma: [
    { code: 'aral', name: 'Aral Maktar' },
    { code: 'bran', name: 'Bran Ator' },
    { code: 'aird', name: 'Aird Engard' }
  ],
  ume: [{ code: 'temperia', name: 'Temperia, la perla del sud' }],
  eal: [{ code: 'vinyara', name: 'Vinyara' }],
  esi: [{ code: 'vinyara', name: 'Vinyara' }],
  dra: [{ code: 'chalal', name: 'Chalal, la Città dai Mille Veli' }],
  drw: [{ code: "che'el", name: "Sacro Che'el" }],
  hal: [{ code: 'cala', name: 'Cala di Sendar' }],
  nan: [{ code: 'druin', name: 'Druin, la città sotto la montagna' }],
  orc: [
    { code: 'dagalur', name: "Dagular, l'oscura fortezza" },
    { code: 'thabad', name: 'Il relitto di Thabad' }
  ],
  gob: [
    { code: 'dagalur', name: "Dagular, l'oscura fortezza" },
    { code: 'thabad', name: 'Il relitto di Thabad' }
  ],
  els: [{ code: 'vinyara', name: 'Vinyara' }]
}


export const getLocation = (eth, code): any => {
  return locations[eth].find(loc => loc.code === code)
}
