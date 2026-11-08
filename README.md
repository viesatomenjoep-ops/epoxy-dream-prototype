# Epoxy Dream — prototype

Browserprototype voor een webshop in handgemaakte epoxy river tables. Twee pagina's, geen
bouwstap, geen framework: open `index.html` en het draait.

**Live:** zie de Vercel-link bij dit project.

## Wat het laat zien

- **Homepage** met videohero, een kleuretalage die de rivier live van kleur laat wisselen, een
  collectie van acht tafels en de zeven processtappen.
- **Configurator** (`configurator.html`) met een tafel die volledig in de browser in 3D wordt
  opgebouwd. Maten, houtsoort, onderstel en 25 epoxykleuren zijn instelbaar, de prijs rekent live
  mee en elke configuratie heeft zijn eigen deelbare URL.

## Hoe de 3D werkt

Er wordt geen enkel 3D-model ingeladen. `assets/js/table3d.js` bouwt elke tafel op uit zijn maten:

- De **live edge** komt uit deterministische value-noise. Dezelfde seed geeft altijd dezelfde rand,
  dus één tafel ziet er bij elke paginaweergave identiek uit, terwijl verschillende tafels van
  elkaar verschillen.
- De **houtnerf** en de **metallic swirls** worden met Canvas 2D getekend en als textuur gebruikt.
  Geen externe afbeeldingen, dus niets om te laden of te beheren.
- De **epoxy** is een `MeshPhysicalMaterial` met echte transmissie: `attenuationColor` en
  `attenuationDistance` zorgen dat de kleur dieper wordt naarmate de hars dikker is — precies zoals
  in het echt. Vlakke kleur verkoopt geen epoxy.
- Kleurwissels **tweenen in 300 ms** over kleur, demping, transmissie en ruwheid tegelijk. Die
  overgang ís het verkoopargument.
- De acht miniaturen op de homepage worden met **één gedeelde renderer** achter elkaar gerenderd en
  als WebP-afbeelding in de kaart gezet. Acht losse WebGL-contexten zou de pagina slopen.

Three.js komt via een importmap van jsDelivr. In de echte webshop wordt die self-hosted.

## Lokaal draaien

Een module-script heeft een echte server nodig; `file://` werkt niet.

```bash
npx serve .
# of
python3 -m http.server 4321
```

## Wat het nog niet is

Dit is een etalage, geen winkel. Afrekenen zit er niet in: dat loopt in de echte webshop via
Shopify met Shopify Payments en Mollie voor iDEAL. De knop *Deze tafel aanvragen* laat alleen zien
wat er dán zou gebeuren.

De video's zijn met AI gegenereerd en staan er als plaatshouder tot er echte opnames uit de
werkplaats zijn. Het logo is een woordmerk-plaatshouder.

In de footer staan `[[AANVULLEN: ...]]`-merktekens op de plekken waar bedrijfsgegevens horen.

## Bestanden

```
index.html              homepage
configurator.html       de 3D-configurator
assets/js/data.js       kleuren, houtsoorten, onderstellen, tafels, prijsformules
assets/js/table3d.js    procedurele geometrie, materialen en scène-opzet
assets/js/home.js       homepage: etalage, tafelgrid, miniaturen, lazy video
assets/js/configurator.js  bediening, prijsopbouw, URL-status, toegankelijkheid
assets/css/theme.css    huisstijl
video/                  webvarianten: mp4, webm, mobiele mp4 en poster
```

De prijsformules in `data.js` gebruiken dezelfde kengetallen als de werkplaatscalculatie:
uurtarief € 45, brutomarge 35%, btw 21%. Het aantal uren wordt hier geschat uit oppervlak en
harsvolume, waar de calculatie per model een vast urenaantal hanteert — daardoor kunnen de
bedragen enkele procenten afwijken.
