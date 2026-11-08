import * as THREE from 'three';
import { Tafel, maakScene, STANDEN, webglBeschikbaar, seedVan } from './table3d.js';
import { KLEUREN, HOUTSOORTEN, ONDERSTELLEN, TAFELS, bereken, euro } from './data.js';

const $ = (s, r = document) => r.querySelector(s);

const STANDAARD = {
  lengte: 240, breedte: 95, dikte: 5, rivier: 25,
  hout: 'noten', kleurId: 'oceaan-turquoise', onderstel: 'trapezium',
};

/* ── configuratie uit de URL lezen ──────────────────────────────────── */
function uitUrl() {
  const p = new URLSearchParams(location.search);
  const cfg = { ...STANDAARD };
  const basis = TAFELS.find((t) => t.id === p.get('tafel'));
  if (basis) Object.assign(cfg, {
    lengte: basis.lengte, breedte: basis.breedte, dikte: basis.dikte,
    rivier: basis.rivier, hout: basis.hout, kleurId: basis.kleur,
    onderstel: basis.onderstel, naam: basis.naam,
  });
  const num = (k, min, max) => {
    const v = Number(p.get(k));
    if (Number.isFinite(v) && v >= min && v <= max) cfg[k] = v;
  };
  num('lengte', 50, 400); num('breedte', 40, 120);
  num('dikte', 4, 6); num('rivier', 6, 45);
  if (HOUTSOORTEN[p.get('hout')]) cfg.hout = p.get('hout');
  if (ONDERSTELLEN[p.get('onderstel')]) cfg.onderstel = p.get('onderstel');
  if (KLEUREN.some((k) => k.id === p.get('kleur'))) cfg.kleurId = p.get('kleur');
  // de rivier mag nooit breder zijn dan het blad
  cfg.rivier = Math.min(cfg.rivier, cfg.breedte - 20);
  return cfg;
}

function naarUrl(cfg) {
  const p = new URLSearchParams({
    lengte: cfg.lengte, breedte: cfg.breedte, dikte: cfg.dikte,
    rivier: cfg.rivier, hout: cfg.hout, kleur: cfg.kleurId, onderstel: cfg.onderstel,
  });
  history.replaceState(null, '', `${location.pathname}?${p}`);
}

const cfg = uitUrl();
cfg.seed = seedVan(cfg.naam || 'epoxy-dream');

/* ── bedieningspaneel opbouwen ──────────────────────────────────────── */
function schuif(id, label, min, max, stap, eenheid) {
  return `
    <div class="field">
      <label class="field__label" for="${id}">
        <span>${label}</span><span class="field__val" id="${id}-val"></span>
      </label>
      <input type="range" id="${id}" min="${min}" max="${max}" step="${stap}"
             data-eenheid="${eenheid}" value="${cfg[id]}">
    </div>`;
}

function segment(id, label, opties, actief) {
  const knoppen = Object.entries(opties).map(([k, v]) =>
    `<button type="button" class="chip" data-${id}="${k}"
      aria-pressed="${k === actief}">${v.naam}</button>`).join('');
  return `<div class="field">
      <span class="field__label"><span>${label}</span></span>
      <div class="segmented" role="group" aria-label="${label}">${knoppen}</div>
    </div>`;
}

$('#cfg-controls').innerHTML = `
  ${schuif('lengte', 'Lengte', 50, 400, 10, 'cm')}
  ${schuif('breedte', 'Breedte', 40, 120, 5, 'cm')}
  ${schuif('dikte', 'Dikte', 4, 6, 1, 'cm')}
  ${schuif('rivier', 'Breedte epoxyrivier', 6, 45, 1, 'cm')}
  ${segment('hout', 'Houtsoort', HOUTSOORTEN, cfg.hout)}
  ${segment('onderstel', 'Onderstel', ONDERSTELLEN, cfg.onderstel)}
  <div class="field">
    <span class="field__label"><span>Epoxykleur</span>
      <span class="field__val" id="kleur-naam"></span></span>
    <div class="swatches" role="radiogroup" aria-label="Epoxykleur" id="kleur-kiezer"></div>
  </div>`;

$('#kleur-kiezer').innerHTML = KLEUREN.map((k) => `
  <button type="button" class="swatch" role="radio" data-kleur="${k.id}"
    aria-checked="${k.id === cfg.kleurId}" title="${k.naam}"
    style="background:${k.hex}">
    <span class="sr-only">${k.naam}${k.meerprijs ? `, meerprijs ${euro(k.meerprijs)}` : ''}</span>
  </button>`).join('');

/* ── prijs ──────────────────────────────────────────────────────────── */
function werkPrijsBij() {
  const r = bereken(cfg);
  $('#prijs-groot').textContent = euro(r.inclBtw);
  $('#prijs-sub').textContent =
    `${euro(r.advies)} excl. btw · ${r.kg.toLocaleString('nl-NL',{maximumFractionDigits:1})} kg epoxy · ± ${Math.round(r.uren)} uur werk`;
  $('#prijs-opbouw').innerHTML = `
    <dt>Hout (${HOUTSOORTEN[cfg.hout].naam})</dt><dd>${euro(r.posten.hout)}</dd>
    <dt>Epoxy (${r.kg.toLocaleString('nl-NL',{maximumFractionDigits:1})} kg)</dt><dd>${euro(r.posten.epoxy)}</dd>
    <dt>Pigment</dt><dd>${euro(r.posten.pigment)}</dd>
    <dt>Onderstel</dt><dd>${euro(r.posten.onderstel)}</dd>
    <dt>Mal en verbruik</dt><dd>${euro(r.posten.mal)}</dd>
    <dt>Schuren en polijsten</dt><dd>${euro(r.posten.schuren)}</dd>
    <dt>Olie</dt><dd>${euro(r.posten.olie)}</dd>
    <dt>Arbeid (${Math.round(r.uren)} uur)</dt><dd>${euro(r.arbeid)}</dd>
    <dt>Overhead</dt><dd>${euro(r.overhead)}</dd>
    <dt class="total">Adviesprijs excl. btw</dt><dd class="total">${euro(r.advies)}</dd>`;
  return r;
}

function meld() {
  const k = KLEUREN.find((x) => x.id === cfg.kleurId);
  const r = bereken(cfg);
  const tekst = `${HOUTSOORTEN[cfg.hout].naam} met ${k.naam}, ${cfg.lengte} bij ${cfg.breedte} centimeter, ${euro(r.inclBtw)}`;
  $('#cfg-live').textContent = tekst;
  const canvas = $('#cfg-canvas');
  if (canvas) canvas.setAttribute('aria-label', `3D-weergave van een epoxy tafel: ${tekst}`);
}

/* ── 3D ─────────────────────────────────────────────────────────────── */
let tafel = null, scene3d = null, doelStand = null;

function startDrie() {
  const houder = $('#cfg-canvas');
  scene3d = maakScene(houder, { interactief: true });
  scene3d.renderer.domElement.id = 'cfg-webgl';
  tafel = new Tafel(scene3d.scene);
  tafel.bouw(cfg);
  $('#cfg-laden')?.remove();

  const klok = new THREE.Clock();
  (function lus() {
    requestAnimationFrame(lus);
    const dt = Math.min(klok.getDelta(), 0.1);
    tafel.update();
    if (doelStand) {
      const k = 1 - Math.pow(0.0015, dt);
      scene3d.camera.position.lerp(doelStand.pos, k);
      scene3d.controls.target.lerp(doelStand.doel, k);
      if (scene3d.camera.position.distanceTo(doelStand.pos) < 0.012) doelStand = null;
    }
    scene3d.controls.update();
    scene3d.renderer.render(scene3d.scene, scene3d.camera);
  })();
}

function herbouw() {
  cfg.rivier = Math.min(cfg.rivier, cfg.breedte - 20);
  $('#rivier').max = String(cfg.breedte - 20);
  $('#rivier').value = String(cfg.rivier);
  if (tafel) tafel.bouw(cfg);
  naLangeWijziging();
}

function naLangeWijziging() {
  for (const el of document.querySelectorAll('input[type=range]')) {
    $(`#${el.id}-val`).textContent = `${cfg[el.id]} ${el.dataset.eenheid}`;
  }
  $('#kleur-naam').textContent = KLEUREN.find((k) => k.id === cfg.kleurId).naam;
  werkPrijsBij();
  naarUrl(cfg);
  meld();
}

/* ── interactie ─────────────────────────────────────────────────────── */
let herbouwTimer = null;
document.addEventListener('input', (e) => {
  const el = e.target;
  if (el.type !== 'range') return;
  cfg[el.id] = Number(el.value);
  naLangeWijziging();
  clearTimeout(herbouwTimer);
  herbouwTimer = setTimeout(herbouw, 110);   // niet bij elke pixel opnieuw opbouwen
});

document.addEventListener('click', (e) => {
  const sw = e.target.closest('[data-kleur]');
  if (sw) {
    cfg.kleurId = sw.dataset.kleur;
    for (const b of document.querySelectorAll('[data-kleur]')) {
      b.setAttribute('aria-checked', String(b === sw));
    }
    tafel?.zetKleur(cfg.kleurId);
    naLangeWijziging();
    return;
  }
  for (const sleutel of ['hout', 'onderstel']) {
    const btn = e.target.closest(`[data-${sleutel}]`);
    if (btn) {
      cfg[sleutel] = btn.dataset[sleutel];
      for (const b of document.querySelectorAll(`[data-${sleutel}]`)) {
        b.setAttribute('aria-pressed', String(b === btn));
      }
      herbouw();
      return;
    }
  }
  const stand = e.target.closest('[data-stand]');
  if (stand && scene3d) {
    const s = STANDEN[stand.dataset.stand];
    const schaal = Math.max(0.65, cfg.lengte / 240);
    doelStand = {
      pos: new THREE.Vector3(...s.pos).multiplyScalar(schaal),
      doel: new THREE.Vector3(...s.doel),
    };
    for (const b of document.querySelectorAll('[data-stand]')) {
      b.setAttribute('aria-pressed', String(b === stand));
    }
  }
  const zoom = e.target.closest('[data-zoom]');
  if (zoom && scene3d) {
    const f = zoom.dataset.zoom === 'in' ? 0.82 : 1.22;
    const t = scene3d.controls.target;
    const p = scene3d.camera.position;
    const nieuw = p.clone().sub(t).multiplyScalar(f).add(t);
    if (nieuw.distanceTo(t) > 0.8 && nieuw.distanceTo(t) < 12) scene3d.camera.position.copy(nieuw);
  }
});

// pijltjestoetsen door de kleuren
$('#kleur-kiezer').addEventListener('keydown', (e) => {
  const richting = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!richting) return;
  e.preventDefault();
  const knoppen = [...document.querySelectorAll('[data-kleur]')];
  const i = knoppen.findIndex((b) => b.getAttribute('aria-checked') === 'true');
  const volgende = knoppen[(i + richting + knoppen.length) % knoppen.length];
  volgende.focus();
  volgende.click();
});

$('#cfg-aanvragen').addEventListener('click', () => {
  const r = bereken(cfg);
  const k = KLEUREN.find((x) => x.id === cfg.kleurId);
  $('#cfg-bevestiging').hidden = false;
  $('#cfg-bevestiging').innerHTML = `
    <strong>Aanvraag klaargezet.</strong> In de echte webshop gaat deze configuratie als
    maatwerkregel naar de winkelwagen, met een schermafbeelding van je 3D-weergave erbij
    zodat de werkplaats precies ziet wat jij voor je zag.
    <br><br>
    ${HOUTSOORTEN[cfg.hout].naam} · ${k.naam} · ${cfg.lengte}×${cfg.breedte}×${cfg.dikte} cm ·
    ${ONDERSTELLEN[cfg.onderstel].naam} · <strong>${euro(r.inclBtw)}</strong> incl. btw
    <br><br>
    <a class="card__link" href="${location.href}">Deel deze configuratie met deze link</a>`;
  $('#cfg-bevestiging').scrollIntoView({ block: 'nearest' });
});

/* ── opstarten ──────────────────────────────────────────────────────── */
naLangeWijziging();

if (webglBeschikbaar() && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  startDrie();
} else {
  document.body.classList.add('no-webgl');
  $('#cfg-laden').innerHTML =
    '<p style="padding:2rem;text-align:center;max-width:34ch">Je apparaat of je instellingen ' +
    'laten geen 3D toe. De configurator en de prijsberekening werken gewoon door.</p>';
}
