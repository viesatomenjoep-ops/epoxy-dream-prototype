import { Tafel, maakScene, webglBeschikbaar, seedVan } from './table3d.js';
import { KLEUREN, HOUTSOORTEN, TAFELS, bereken, euro } from './data.js';

const $ = (s, r = document) => r.querySelector(s);

/* ── kleuretalage: de rivier van kleur laten wisselen ───────────────── */
const ETALAGE = ['oceaan-turquoise', 'zwart-goud', 'smaragd', 'diep-zeeblauw',
                 'terracotta', 'diep-violet', 'pearl-white', 'amber'];

$('#etalage-swatches').innerHTML = ETALAGE.map((id, i) => {
  const k = KLEUREN.find((x) => x.id === id);
  return `<button type="button" class="swatch" role="radio" data-etalage="${id}"
    aria-checked="${i === 0}" title="${k.naam}" style="background:${k.hex}">
    <span class="sr-only">${k.naam}</span></button>`;
}).join('');

function zetEtalage(id) {
  const k = KLEUREN.find((x) => x.id === id);
  $('#etalage-tint').style.backgroundColor = k.hex;
  $('#etalage-glow').style.backgroundColor = k.swirl;
  $('#etalage-naam').textContent = k.naam;
  $('#etalage-info').textContent =
    `${k.finish}${k.swirlStijl !== 'geen' ? ` · ${k.swirlStijl}` : ''}` +
    `${k.meerprijs ? ` · meerprijs ${euro(k.meerprijs)}` : ' · geen meerprijs'}`;
  for (const b of document.querySelectorAll('[data-etalage]')) {
    b.setAttribute('aria-checked', String(b.dataset.etalage === id));
  }
}
zetEtalage(ETALAGE[0]);

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-etalage]');
  if (b) zetEtalage(b.dataset.etalage);
});

/* ── tafelgrid ──────────────────────────────────────────────────────── */
$('#tafel-grid').innerHTML = TAFELS.map((t, i) => {
  const r = bereken({ ...t, kleurId: t.kleur });
  const kleur = KLEUREN.find((k) => k.id === t.kleur);
  const voorraad = t.levertijd <= 4;
  return `
  <article class="card">
    <div class="card__thumb" data-thumb="${t.id}">
      <span class="card__badge ${voorraad ? '' : 'card__badge--maat'}">
        ${voorraad ? 'Direct leverbaar' : `Op maat · ${t.levertijd} weken`}</span>
    </div>
    <div class="card__body">
      <div class="card__top">
        <h3>${t.naam}</h3>
        <span class="card__price">${euro(r.inclBtw)}</span>
      </div>
      <p class="card__meta">${t.type} · ${HOUTSOORTEN[t.hout].naam} · ${kleur.naam} ·
        ${t.lengte}×${t.breedte}×${t.dikte} cm</p>
      <p class="card__pitch">${t.pitch}</p>
      <a class="card__link" href="configurator.html?tafel=${t.id}">Pas deze tafel aan →</a>
    </div>
  </article>`;
}).join('');

/* ── miniaturen: één renderer, acht keer gebruikt ───────────────────── */
async function maakMiniaturen() {
  const houder = document.createElement('div');
  houder.style.cssText = 'position:fixed;left:-9999px;top:0;width:640px;height:480px';
  document.body.appendChild(houder);

  const s = maakScene(houder, { interactief: false });
  s.camera.position.set(1.95, 1.4, 2.15);
  s.camera.lookAt(0, 0.55, 0);
  const tafel = new Tafel(s.scene);

  for (const t of TAFELS) {
    tafel.bouw({ ...t, kleurId: t.kleur, seed: seedVan(t.id) });
    // de kleur-tween overslaan: direct op eindwaarde
    tafel.zetKleur(t.kleur, true);
    const schaal = Math.max(0.62, t.lengte / 250);
    s.camera.position.set(1.95 * schaal, 1.4 * schaal, 2.15 * schaal);
    s.camera.lookAt(0, 0.55, 0);
    s.renderer.render(s.scene, s.camera);

    const doel = document.querySelector(`[data-thumb="${t.id}"]`);
    if (doel) {
      const img = new Image();
      img.alt = `${t.naam}, ${HOUTSOORTEN[t.hout].naam} met ${KLEUREN.find(k => k.id === t.kleur).naam}`;
      img.src = s.renderer.domElement.toDataURL('image/webp', 0.86);
      img.style.cssText = 'width:100%;height:100%;object-fit:cover';
      doel.appendChild(img);
    }
    await new Promise((r) => requestAnimationFrame(r));
  }

  s.renderer.dispose();
  s.pmrem.dispose();
  houder.remove();
}

if (webglBeschikbaar()) {
  if ('requestIdleCallback' in window) requestIdleCallback(() => maakMiniaturen(), { timeout: 2500 });
  else setTimeout(maakMiniaturen, 400);
} else {
  for (const el of document.querySelectorAll('[data-thumb]')) {
    el.insertAdjacentHTML('beforeend',
      '<div style="display:grid;place-items:center;height:100%;font-size:.82rem;color:#6B6460">' +
      'Foto volgt</div>');
  }
}

/* ── video's pas laden als ze in beeld komen ────────────────────────── */
const traag = navigator.connection &&
  ['slow-2g', '2g'].includes(navigator.connection.effectiveType);
const stilzitten = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (traag || stilzitten) {
  for (const v of document.querySelectorAll('video')) {
    v.removeAttribute('autoplay');
    v.pause();
  }
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) { e.target.pause(); continue; }
      if (e.target.dataset.lazy) {
        e.target.preload = 'auto';
        e.target.load();
        delete e.target.dataset.lazy;
      }
      e.target.play().catch(() => {});
    }
  }, { rootMargin: '150px' });
  for (const v of document.querySelectorAll('video')) io.observe(v);
}
