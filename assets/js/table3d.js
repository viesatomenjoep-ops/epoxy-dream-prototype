// Procedurele epoxy river table in Three.js.
// Niets is een ingeladen model: elke tafel wordt uit de maten opgebouwd, zodat
// lengte, breedte, dikte, rivierbreedte en kleur allemaal instelbaar zijn zonder assets.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { HOUTSOORTEN, ONDERSTELLEN, KLEUREN } from './data.js';

const TAFELHOOGTE = 0.75;   // meter, bovenkant blad
const SEG = 150;            // segmenten langs de lengte van de live edge

/* ── deterministische ruis ──────────────────────────────────────────────
   Dezelfde seed geeft altijd dezelfde rand, zodat één tafel er bij elke
   paginaweergave identiek uitziet maar verschillende tafels verschillen. */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function valueNoise(seed, punten = 14) {
  const rnd = mulberry32(seed);
  const p = Array.from({ length: punten }, () => rnd() * 2 - 1);
  return (t) => {
    const x = Math.max(0, Math.min(0.9999, t)) * (p.length - 1);
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    return p[i] * (1 - u) + p[i + 1] * u;
  };
}

export function seedVan(tekst) {
  let h = 2166136261;
  for (let i = 0; i < tekst.length; i++) {
    h ^= tekst.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* ── texturen, in code getekend ─────────────────────────────────────── */
function houtTextuur(soort) {
  const S = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const h = HOUTSOORTEN[soort];

  g.fillStyle = h.hex;
  g.fillRect(0, 0, S, S);

  const rnd = mulberry32(seedVan(soort));
  // nerflijnen lopen horizontaal; de U-as volgt de lengte van de tafel
  for (let i = 0; i < 260; i++) {
    const y = rnd() * S;
    const dik = 0.4 + rnd() * 2.6;
    const alpha = 0.04 + rnd() * 0.16;
    g.strokeStyle = h.donker;
    g.globalAlpha = alpha;
    g.lineWidth = dik;
    g.beginPath();
    g.moveTo(-10, y);
    const golf = 6 + rnd() * 26;
    const freq = 1 + rnd() * 2.5;
    for (let x = 0; x <= S + 10; x += 12) {
      g.lineTo(x, y + Math.sin((x / S) * Math.PI * 2 * freq + i) * golf);
    }
    g.stroke();
  }
  // enkele knoesten
  g.globalAlpha = 1;
  for (let k = 0; k < 4; k++) {
    const kx = rnd() * S, ky = rnd() * S, kr = 10 + rnd() * 26;
    const grad = g.createRadialGradient(kx, ky, 1, kx, ky, kr);
    grad.addColorStop(0, h.donker);
    grad.addColorStop(0.55, h.donker + 'AA');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.beginPath();
    g.ellipse(kx, ky, kr * 1.5, kr, rnd() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function swirlTextuur(kleurHex, stijl) {
  const S = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  g.clearRect(0, 0, S, S);
  if (stijl === 'geen') return null;

  const rnd = mulberry32(seedVan(kleurHex + stijl));
  const aantal = stijl === 'wit-schuim' ? 90 : 55;
  for (let i = 0; i < aantal; i++) {
    const y0 = rnd() * S;
    g.strokeStyle = kleurHex;
    g.globalAlpha = (stijl === 'pearl' ? 0.10 : 0.20) + rnd() * 0.3;
    g.lineWidth = 0.6 + rnd() * (stijl === 'wit-schuim' ? 7 : 4);
    g.beginPath();
    g.moveTo(-20, y0);
    const amp = 10 + rnd() * 70;
    const freq = 0.7 + rnd() * 3;
    const fase = rnd() * 10;
    for (let x = 0; x <= S + 20; x += 10) {
      const t = x / S;
      g.lineTo(x, y0 + Math.sin(t * Math.PI * 2 * freq + fase) * amp
                    + Math.sin(t * Math.PI * 7 + fase * 2) * amp * 0.26);
    }
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function contactSchaduw() {
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, 'rgba(30,22,16,.46)');
  grad.addColorStop(0.55, 'rgba(30,22,16,.16)');
  grad.addColorStop(1, 'rgba(30,22,16,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ── vormen ─────────────────────────────────────────────────────────── */
function bouwVormen({ L, W, R, seed }) {
  const halfL = L / 2, halfW = W / 2, halfR = R / 2;
  const amp = Math.min(R * 0.42, 0.075);
  const nL = valueNoise(seed);
  const nR = valueNoise(seed + 9173);
  const x = (t) => -halfL + t * L;
  const yL = (t) => -halfR + amp * nL(t);
  const yR = (t) => halfR + amp * nR(t);

  const links = new THREE.Shape();
  links.moveTo(-halfL, -halfW);
  links.lineTo(halfL, -halfW);
  for (let i = SEG; i >= 0; i--) links.lineTo(x(i / SEG), yL(i / SEG));
  links.closePath();

  const rechts = new THREE.Shape();
  rechts.moveTo(-halfL, halfW);
  rechts.lineTo(halfL, halfW);
  for (let i = SEG; i >= 0; i--) rechts.lineTo(x(i / SEG), yR(i / SEG));
  rechts.closePath();

  const rivier = new THREE.Shape();
  rivier.moveTo(-halfL, yL(0));
  for (let i = 1; i <= SEG; i++) rivier.lineTo(x(i / SEG), yL(i / SEG));
  for (let i = SEG; i >= 0; i--) rivier.lineTo(x(i / SEG), yR(i / SEG));
  rivier.closePath();

  return { links, rechts, rivier };
}

/* ── onderstellen ───────────────────────────────────────────────────── */
function bouwOnderstel(soort, { L, W, T }) {
  const spec = ONDERSTELLEN[soort];
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(spec.kleur),
    metalness: spec.metaal,
    roughness: spec.ruwheid,
  });
  const g = new THREE.Group();
  const h = TAFELHOOGTE - T;
  const inzet = Math.min(0.42, L * 0.17);
  const add = (geo, x, y, z, rot) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    if (rot) m.rotation.z = rot;
    g.add(m);
  };

  if (soort === 'hairpin') {
    const geo = new THREE.CylinderGeometry(0.009, 0.009, h, 10);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(sx * (L / 2 - inzet), h / 2, sz * (W / 2 - 0.09));
      m.rotation.z = sx * 0.055;
      m.rotation.x = -sz * 0.055;
      g.add(m);
    }
  } else if (soort === 'u') {
    const poot = new THREE.BoxGeometry(0.05, h, W * 0.72);
    const voet = new THREE.BoxGeometry(0.05, 0.022, W * 0.86);
    for (const sx of [-1, 1]) {
      add(poot, sx * (L / 2 - inzet), h / 2, 0);
      add(voet, sx * (L / 2 - inzet), 0.011, 0);
    }
  } else if (soort === 'trapezium' || soort === 'messing') {
    const schuin = new THREE.BoxGeometry(0.045, h * 1.02, 0.07);
    const voet = new THREE.BoxGeometry(0.045, 0.024, W * 0.88);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const m = new THREE.Mesh(schuin, mat);
        m.position.set(sx * (L / 2 - inzet), h / 2, sz * W * 0.3);
        m.rotation.x = sz * 0.17;
        g.add(m);
      }
      add(voet, sx * (L / 2 - inzet), 0.012, 0);
    }
  } else if (soort === 'x') {
    const diag = new THREE.BoxGeometry(0.042, Math.hypot(h, W * 0.7), 0.055);
    const voet = new THREE.BoxGeometry(0.045, 0.024, W * 0.86);
    for (const sx of [-1, 1]) {
      for (const d of [1, -1]) {
        const m = new THREE.Mesh(diag, mat);
        m.position.set(sx * (L / 2 - inzet), h / 2, 0);
        m.rotation.x = d * Math.atan2(W * 0.7, h);
        g.add(m);
      }
      add(voet, sx * (L / 2 - inzet), 0.012, 0);
    }
  }
  return g;
}

/* ── de tafel ───────────────────────────────────────────────────────── */
export class Tafel {
  constructor(scene) {
    this.scene = scene;
    this.groep = new THREE.Group();
    scene.add(this.groep);
    this.houtTex = {};
    this.schaduwTex = contactSchaduw();
    this.huidig = null;
  }

  _houtTextuur(soort) {
    if (!this.houtTex[soort]) this.houtTex[soort] = houtTextuur(soort);
    return this.houtTex[soort];
  }

  /** Bouwt de tafel opnieuw op. Alleen aanroepen als de maten veranderen. */
  bouw(cfg) {
    const L = cfg.lengte / 100, W = cfg.breedte / 100, T = cfg.dikte / 100, R = cfg.rivier / 100;
    this.groep.clear();
    this.maten = { L, W, T, R };

    const { links, rechts, rivier } = bouwVormen({ L, W, R, seed: cfg.seed ?? 1234 });

    const houtGeo = (shape) => new THREE.ExtrudeGeometry(shape, {
      depth: T, bevelEnabled: true, bevelThickness: 0.0025,
      bevelSize: 0.0025, bevelSegments: 2, curveSegments: 1,
    });

    const tex = this._houtTextuur(cfg.hout);
    tex.repeat.set(1 / 0.75, 1 / 0.75);
    this.houtMat = new THREE.MeshPhysicalMaterial({
      map: tex,
      color: 0xffffff,
      roughness: HOUTSOORTEN[cfg.hout].ruwheid,
      metalness: 0,
      clearcoat: 0.42,
      clearcoatRoughness: 0.22,
    });

    this.epoxyMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0.03,
      transmission: 0.9, ior: 1.52, thickness: T,
      clearcoat: 1, clearcoatRoughness: 0.02,
      attenuationDistance: 0.1, attenuationColor: new THREE.Color(0xffffff),
    });

    this.swirlMat = new THREE.MeshPhysicalMaterial({
      transparent: true, metalness: 0.9, roughness: 0.2,
      depthWrite: false, opacity: 0.85,
    });

    const blad = new THREE.Group();
    blad.add(new THREE.Mesh(houtGeo(links), this.houtMat));
    blad.add(new THREE.Mesh(houtGeo(rechts), this.houtMat));

    const riviermesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(rivier, { depth: T * 0.99, bevelEnabled: false, curveSegments: 1 }),
      this.epoxyMat,
    );
    blad.add(riviermesh);

    this.swirlMesh = new THREE.Mesh(new THREE.ShapeGeometry(rivier), this.swirlMat);
    this.swirlMesh.position.z = T * 0.992;
    blad.add(this.swirlMesh);

    blad.rotation.x = -Math.PI / 2;
    blad.position.y = TAFELHOOGTE - T;
    this.groep.add(blad);

    this.groep.add(bouwOnderstel(cfg.onderstel, { L, W, T }));

    const schaduw = new THREE.Mesh(
      new THREE.PlaneGeometry(L * 1.5, W * 2.4),
      new THREE.MeshBasicMaterial({ map: this.schaduwTex, transparent: true, depthWrite: false }),
    );
    schaduw.rotation.x = -Math.PI / 2;
    schaduw.position.y = 0.002;
    this.groep.add(schaduw);

    this.zetKleur(cfg.kleurId, true);
    this.huidig = { ...cfg };
  }

  /** Wisselt alleen de epoxykleur. Veel goedkoper dan opnieuw bouwen. */
  zetKleur(kleurId, direct = false) {
    const k = KLEUREN.find((x) => x.id === kleurId) || KLEUREN[0];
    const doelKleur = new THREE.Color(k.hex);
    const doelDemping = new THREE.Color(k.demping);
    const doelTransmissie = Math.max(0.05, (1 - k.dekking) * 0.95 + 0.05);
    const doelRuwheid = k.finish === 'mat' ? 0.5 : k.finish === 'zijdeglans' ? 0.17 : 0.03;
    const doelAfstand = 0.3 - k.dekking * 0.285;

    const swirl = swirlTextuur(k.swirl, k.swirlStijl);
    if (this.swirlMat.map) this.swirlMat.map.dispose();
    this.swirlMat.map = swirl;
    this.swirlMat.visible = Boolean(swirl);
    if (swirl) {
      swirl.repeat.set(1 / 0.9, 1 / 0.9);
      this.swirlMat.color = new THREE.Color(k.swirl);
      this.swirlMat.opacity = k.swirlStijl === 'pearl' ? 0.55 : 0.82;
      this.swirlMat.needsUpdate = true;
    }

    this._tween = { doelKleur, doelDemping, doelTransmissie, doelRuwheid, doelAfstand,
                    start: performance.now(), duur: direct ? 0 : 300 };
    if (direct) this._pasKleurToe(1);
  }

  _pasKleurToe(f) {
    const t = this._tween;
    const m = this.epoxyMat;
    m.color.lerp(t.doelKleur, f);
    m.attenuationColor.lerp(t.doelDemping, f);
    m.transmission += (t.doelTransmissie - m.transmission) * f;
    m.roughness += (t.doelRuwheid - m.roughness) * f;
    m.attenuationDistance += (t.doelAfstand - m.attenuationDistance) * f;
  }

  update() {
    const t = this._tween;
    if (!t || t.duur === 0) return;
    const p = Math.min(1, (performance.now() - t.start) / t.duur);
    const e = p * p * (3 - 2 * p);
    this._pasKleurToe(e > 0.99 ? 1 : 0.22);
    if (p >= 1) this._tween = null;
  }
}

/* ── scène-opzet ────────────────────────────────────────────────────── */
export function maakScene(canvasHouder, { interactief = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  canvasHouder.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const zon = new THREE.DirectionalLight(0xfff4e2, 1.5);
  zon.position.set(2.4, 3.4, 1.8);
  scene.add(zon);
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(2.1, 1.35, 2.3);

  let controls = null;
  if (interactief) {
    // Het muiswiel mag de pagina scrollen, niet zoomen. Deze capture-listener
    // staat vóór die van OrbitControls en blokkeert die daarom.
    renderer.domElement.addEventListener('wheel', (e) => e.stopImmediatePropagation(), { capture: true });
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = 0.12;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.target.set(0, 0.56, 0);
  }

  function pasMaatAan() {
    const r = canvasHouder.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  pasMaatAan();
  new ResizeObserver(pasMaatAan).observe(canvasHouder);

  return { renderer, scene, camera, controls, pasMaatAan, pmrem };
}

export const STANDEN = {
  hero: { pos: [2.05, 1.3, 2.25], doel: [0, 0.56, 0] },
  boven: { pos: [0.01, 3.1, 0.35], doel: [0, 0.7, 0] },
  macro: { pos: [0.55, 1.08, 0.72], doel: [0, 0.74, 0] },
  zij: { pos: [0.02, 0.98, 3.0], doel: [0, 0.6, 0] },
};

export function webglBeschikbaar() {
  try {
    const c = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}
