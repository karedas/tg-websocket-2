export interface CharacterAccount {
  race: string;
  ethnicity: string;
  location: string;
  culture: string;
  attributes: {
    strength: number;
    constitution: number;
    size: number;
    dexterity: number;
    speed: number;
    empathy: number;
    intelligence: number;
    willpower: number;
  };
  general: {
    name: string;
    gender: string | "m";
    email: string;
    password: string | null;
  };
}
