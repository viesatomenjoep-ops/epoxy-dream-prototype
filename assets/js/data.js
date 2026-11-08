// Alle gegevens van het prototype op één plek.
// In de echte Shopify-webshop worden de kleuren metaobjects en de tafels producten;
// de structuur hieronder is daar bewust al op voorbereid.

export const KLEUREN = [
  { id: 'oceaan-turquoise', naam: 'Oceaan Turquoise', hex: '#1E8E8E', demping: '#0A4F52', swirl: '#E8D9A8', swirlStijl: 'pearl',  dekking: 0.18, finish: 'glans', meerprijs: 0 },
  { id: 'diep-zeeblauw',    naam: 'Diep Zeeblauw',    hex: '#145A8C', demping: '#06233D', swirl: '#CFE4F2', swirlStijl: 'pearl',  dekking: 0.22, finish: 'glans', meerprijs: 0 },
  { id: 'petrol',           naam: 'Petrol',           hex: '#11595E', demping: '#06292C', swirl: '#9FD2CE', swirlStijl: 'pearl',  dekking: 0.20, finish: 'glans', meerprijs: 0 },
  { id: 'smaragd',          naam: 'Smaragd',          hex: '#0E7A52', demping: '#033421', swirl: '#BFE8CF', swirlStijl: 'pearl',  dekking: 0.18, finish: 'glans', meerprijs: 40 },
  { id: 'mosgroen',         naam: 'Mosgroen',         hex: '#4A6B35', demping: '#22301A', swirl: '#CBD8A8', swirlStijl: 'geen',   dekking: 0.45, finish: 'zijdeglans', meerprijs: 0 },
  { id: 'zwart-goud',       naam: 'Zwart-Goud',       hex: '#141414', demping: '#000000', swirl: '#D4A94F', swirlStijl: 'goud',   dekking: 0.92, finish: 'glans', meerprijs: 120 },
  { id: 'antraciet',        naam: 'Antraciet',        hex: '#2E3134', demping: '#121416', swirl: '#8A9196', swirlStijl: 'zilver', dekking: 0.85, finish: 'zijdeglans', meerprijs: 0 },
  { id: 'zuiver-wit',       naam: 'Zuiver Wit',       hex: '#F2F0EC', demping: '#D8D4CC', swirl: '#FFFFFF', swirlStijl: 'wit-schuim', dekking: 0.95, finish: 'glans', meerprijs: 0 },
  { id: 'ivoor',            naam: 'Ivoor',            hex: '#EADFC8', demping: '#C9B894', swirl: '#FFF6E4', swirlStijl: 'pearl',  dekking: 0.88, finish: 'zijdeglans', meerprijs: 0 },
  { id: 'zand',             naam: 'Zand',             hex: '#C8AE86', demping: '#9B7F55', swirl: '#F0E2C8', swirlStijl: 'pearl',  dekking: 0.70, finish: 'mat',   meerprijs: 0 },
  { id: 'terracotta',       naam: 'Terracotta',       hex: '#B05B38', demping: '#6B2F18', swirl: '#E8C0A0', swirlStijl: 'koper',  dekking: 0.62, finish: 'zijdeglans', meerprijs: 0 },
  { id: 'bordeaux',         naam: 'Bordeaux',         hex: '#6E1F2C', demping: '#330A12', swirl: '#D8A0A8', swirlStijl: 'pearl',  dekking: 0.55, finish: 'glans', meerprijs: 40 },
  { id: 'robijn',           naam: 'Robijn',           hex: '#A3152B', demping: '#4D0411', swirl: '#F0B8BE', swirlStijl: 'pearl',  dekking: 0.30, finish: 'glans', meerprijs: 60 },
  { id: 'oranje-lava',      naam: 'Oranje Lava',      hex: '#D1541B', demping: '#7A2605', swirl: '#FFC27A', swirlStijl: 'goud',   dekking: 0.35, finish: 'glans', meerprijs: 40 },
  { id: 'amber',            naam: 'Amber',            hex: '#C8861A', demping: '#6E4204', swirl: '#FFE0A0', swirlStijl: 'goud',   dekking: 0.16, finish: 'glans', meerprijs: 0 },
  { id: 'mosterdgeel',      naam: 'Mosterdgeel',      hex: '#C9A227', demping: '#7A5E08', swirl: '#F5E3A0', swirlStijl: 'geen',   dekking: 0.60, finish: 'zijdeglans', meerprijs: 0 },
  { id: 'zacht-roze',       naam: 'Zacht Roze',       hex: '#E2A5A8', demping: '#B4696D', swirl: '#FFF0F0', swirlStijl: 'pearl',  dekking: 0.50, finish: 'glans', meerprijs: 0 },
  { id: 'oudroze',          naam: 'Oudroze',          hex: '#C08A84', demping: '#8A5750', swirl: '#F2D6D0', swirlStijl: 'pearl',  dekking: 0.58, finish: 'mat',   meerprijs: 0 },
  { id: 'lila',             naam: 'Lila',             hex: '#9B7FC4', demping: '#5A3F8A', swirl: '#E0D4F2', swirlStijl: 'pearl',  dekking: 0.40, finish: 'glans', meerprijs: 40 },
  { id: 'diep-violet',      naam: 'Diep Violet',      hex: '#4B2D7A', demping: '#1E0F3D', swirl: '#C4A8F0', swirlStijl: 'pearl',  dekking: 0.35, finish: 'glans', meerprijs: 60 },
  { id: 'zilvergrijs',      naam: 'Zilvergrijs',      hex: '#9AA0A4', demping: '#5E6366', swirl: '#E6EAEC', swirlStijl: 'zilver', dekking: 0.72, finish: 'zijdeglans', meerprijs: 40 },
  { id: 'pearl-white',      naam: 'Pearl White',      hex: '#E8E6E0', demping: '#BFBCB4', swirl: '#FFFFFF', swirlStijl: 'pearl',  dekking: 0.80, finish: 'glans', meerprijs: 80 },
  { id: 'koper',            naam: 'Koper',            hex: '#8C4A28', demping: '#4A2110', swirl: '#E09050', swirlStijl: 'koper',  dekking: 0.68, finish: 'glans', meerprijs: 100 },
  { id: 'champagne-goud',   naam: 'Champagne Goud',   hex: '#BFA06A', demping: '#80633A', swirl: '#F2DFAE', swirlStijl: 'goud',   dekking: 0.55, finish: 'glans', meerprijs: 100 },
  { id: 'transparant',      naam: 'Transparant Helder', hex: '#DCE8EC', demping: '#9FBCC4', swirl: '#FFFFFF', swirlStijl: 'geen', dekking: 0.04, finish: 'glans', meerprijs: 0 },
];

export const HOUTSOORTEN = {
  es:      { naam: 'Es',    hex: '#BD9A66', donker: '#7A5C33', prijsM2: 180, ruwheid: 0.62 },
  eiken:   { naam: 'Eiken', hex: '#9C7742', donker: '#5A411D', prijsM2: 250, ruwheid: 0.58 },
  iep:     { naam: 'Iep',   hex: '#8A6035', donker: '#482C12', prijsM2: 320, ruwheid: 0.60 },
  noten:   { naam: 'Noten', hex: '#4F3119', donker: '#241207', prijsM2: 450, ruwheid: 0.52 },
  olijf:   { naam: 'Olijf', hex: '#B09768', donker: '#4E3C1E', prijsM2: 700, ruwheid: 0.48 },
};

export const ONDERSTELLEN = {
  hairpin:   { naam: 'Hairpin',        prijs: 80,  kleur: '#1A1A1A', metaal: 0.85, ruwheid: 0.38 },
  u:         { naam: 'U-frame staal',  prijs: 200, kleur: '#1F1F1F', metaal: 0.80, ruwheid: 0.42 },
  trapezium: { naam: 'Trapezium staal',prijs: 280, kleur: '#232323', metaal: 0.80, ruwheid: 0.40 },
  x:         { naam: 'X-frame staal',  prijs: 320, kleur: '#1F1F1F', metaal: 0.82, ruwheid: 0.40 },
  messing:   { naam: 'Messing',        prijs: 600, kleur: '#B08B4F', metaal: 0.95, ruwheid: 0.25 },
};

// Dezelfde kengetallen als in Epoxy-Dream-Kostprijs-Rekenblad.xlsx
export const TARIEVEN = {
  harsPerKg: 16, soortelijkGewicht: 1.10, verlies: 0.10, pigmentPerKg: 2.5,
  malPerGiet: 45, schuurPerM2: 35, oliePerM2: 15,
  uurtarief: 45, overhead: 0.15, brutomarge: 0.35, btw: 0.21,
};

// Ruwe schatting van de arbeidstijd: opzet + oppervlak + harsvolume.
export function schatUren({ opp, kg }) {
  return 4 + opp * 7 + kg * 0.28;
}

export const TAFELS = [
  { id: 'rivier-noord', naam: 'Rivier Noord', type: 'Eettafel', hout: 'noten', kleur: 'oceaan-turquoise',
    lengte: 240, breedte: 95, dikte: 5, rivier: 25, onderstel: 'trapezium', levertijd: 8,
    pitch: 'Twee notenhouten delen uit dezelfde stam, met een turquoise rivier die bij laag licht van kleur lijkt te wisselen.' },
  { id: 'zwarte-maas', naam: 'Zwarte Maas', type: 'Eettafel', hout: 'eiken', kleur: 'zwart-goud',
    lengte: 280, breedte: 100, dikte: 6, rivier: 30, onderstel: 'messing', levertijd: 10,
    pitch: 'Diepzwarte epoxy met gouden aders door licht eiken. Het meest gefotografeerde blad uit de werkplaats.' },
  { id: 'essenstroom', naam: 'Essenstroom', type: 'Eettafel', hout: 'es', kleur: 'smaragd',
    lengte: 200, breedte: 85, dikte: 4, rivier: 18, onderstel: 'u', levertijd: 6,
    pitch: 'Licht essenhout met een smalle, glasheldere smaragdgroene rivier. De vriendelijkste instap in een echte eettafel.' },
  { id: 'bartafel-werf', naam: 'Bartafel Werf', type: 'Bartafel', hout: 'iep', kleur: 'petrol',
    lengte: 200, breedte: 70, dikte: 5, rivier: 20, onderstel: 'x', levertijd: 7,
    pitch: 'Iep met wilde tekening, op barhoogte. Staat goed tegen een muur van beton of baksteen.' },
  { id: 'salontafel-beek', naam: 'Salontafel Beek', type: 'Salontafel', hout: 'es', kleur: 'diep-zeeblauw',
    lengte: 120, breedte: 60, dikte: 4, rivier: 14, onderstel: 'hairpin', levertijd: 4,
    pitch: 'Compacte salontafel met een diepblauwe beek. Past in vrijwel elke kamer.' },
  { id: 'olijfdelta', naam: 'Olijfdelta', type: 'Statement', hout: 'olijf', kleur: 'champagne-goud',
    lengte: 320, breedte: 110, dikte: 6, rivier: 38, onderstel: 'messing', levertijd: 14,
    pitch: 'Olijfhout met een brede champagnegouden delta. Een tafel waar een gezin jaren omheen zit.' },
  { id: 'bijzettafel-kiezel', naam: 'Bijzettafel Kiezel', type: 'Bijzettafel', hout: 'eiken', kleur: 'amber',
    lengte: 50, breedte: 40, dikte: 4, rivier: 8, onderstel: 'hairpin', levertijd: 3,
    pitch: 'Klein, warm en direct leverbaar. Amber epoxy die oplicht zodra er een lamp bij staat.' },
  { id: 'lila-lijn', naam: 'Lila Lijn', type: 'Salontafel', hout: 'noten', kleur: 'lila',
    lengte: 140, breedte: 65, dikte: 4, rivier: 16, onderstel: 'u', levertijd: 5,
    pitch: 'Donker noten met een onverwachte lila rivier. Voor wie geen blauw of groen wil.' },
];

/** Prijsberekening, identiek aan het rekenblad. */
export function bereken({ lengte, breedte, dikte, hout, rivier, kleurId, onderstel }) {
  const t = TARIEVEN;
  const kleur = KLEUREN.find((k) => k.id === kleurId) || KLEUREN[0];
  const opp = (lengte * breedte) / 10000;
  const oppRivier = (lengte * rivier) / 10000;
  const oppHout = Math.max(0, opp - oppRivier);
  const liter = (lengte * rivier * dikte) / 1000;
  const kg = liter * t.soortelijkGewicht * (1 + t.verlies);

  const posten = {
    hout: oppHout * HOUTSOORTEN[hout].prijsM2 * (dikte / 5),
    epoxy: kg * t.harsPerKg,
    pigment: kg * t.pigmentPerKg + kleur.meerprijs,
    onderstel: ONDERSTELLEN[onderstel].prijs,
    mal: t.malPerGiet,
    schuren: opp * t.schuurPerM2,
    olie: oppHout * t.oliePerM2,
  };
  const materiaal = Object.values(posten).reduce((a, b) => a + b, 0);
  const uren = schatUren({ opp, kg });
  const arbeid = uren * t.uurtarief;
  const overhead = (materiaal + arbeid) * t.overhead;
  const kostprijs = materiaal + arbeid + overhead;
  const advies = Math.ceil(kostprijs / (1 - t.brutomarge) / 50) * 50;

  return { opp, oppHout, liter, kg, uren, posten, materiaal, arbeid, overhead,
           kostprijs, advies, inclBtw: advies * (1 + t.btw) };
}

export const euro = (n) =>
  '€ ' + Math.round(n).toLocaleString('nl-NL');
