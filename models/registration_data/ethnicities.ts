export const ethnicities = {
  human: [
    { name: "Umano Eliantiriano", code: "uma" },
    { name: "Umano Emeriano", code: "ume" },
  ],
  halfling: [{ name: "Halfling dell'Arcipelago", code: "hal" }],
  dwarf: [{ name: "Nano Zanarquon", code: "nan" }],
  elf: [
    { name: "Elfo di Alwenion", code: "eal" },
    { name: "Elfo sinoriano", code: "esi" },
    { name: "Elfo ambrato", code: "dra" },
    { name: "Ilythiiri", code: "drw" },
    { name: "Selvaggio delle radure", code: "els", limited: true },
  ],
  goblin: [{ name: "Pelleverde", code: "gob" }],
  orc: [{ name: "Nktama", code: "orc" }],
};

export const getEthnicity = (race, code): any => {
  return ethnicities[race].find((r) => r.code === code);
};
