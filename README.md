# Puskaasztal.hu — modernizált weboldal (HTML5)

Statikus, keretrendszer nélküli oldal. Nincs WordPress, nincs build lépés,
nincs adatbázis — feltöltöd FTP-n és megy.

## Fájlok

```
index.html                        Főoldal
acelvazas-puskaasztal.html        Acélvázas puskaasztal (+ árlista hossz szerint)
aluvazas-puskaasztal.html         Alumíniumvázas puskaasztal
rozsdamentes-puskaasztal.html     Rozsdamentes acélvázas asztal
asztallapok.html                  Asztallapok + a kapott árlista kép + HTML táblázatok
megrendelo.html                   Megrendelő űrlap élő árkalkulátorral
kapcsolat.html                    Elérhetőségek, szállítás, fizetés
assets/css/style.css              Teljes design system (1 fájl)
assets/js/main.js                 Menü, lightbox, árkalkulátor
assets/img/                       Optimalizált képek
.htaccess                         301 átirányítások a régi WP URL-ekről + cache + gzip
robots.txt, sitemap.xml           SEO alapok
```

## Élesítés

1. Töltsd fel a mappa **tartalmát** a webtár gyökerébe (`public_html/`).
2. A `.htaccess` gondoskodik a régi URL-ek átirányításáról:
   - `/acelvazas-puskaasztal/` → `acelvazas-puskaasztal.html`
   - `/aluvazas-osszecsukhato-puskaasztal/` → `aluvazas-puskaasztal.html`
   - `/rozsdamentes-acelvazas-puskaasztal/` → `rozsdamentes-puskaasztal.html`
   - `/osb-lap/` → `asztallapok.html`
   - `/megrendelo/`, `/kapcsolat/` → megfelelő `.html`
   Ezek nélkül a Google-ban meglévő pozíciók elvesznének.
3. Google Search Console-ban küldd be a `sitemap.xml`-t.

## Megrendelő űrlap — FONTOS

Jelenleg az űrlap **előre kitöltött e-mailt nyit meg** a látogató levelezőjében
(`mailto:info@puskaasztal.hu`). Ez működik, de gyenge konverziójú.

Élesben cseréld le szerveroldali küldésre. A legegyszerűbb (PHP-s tárhelyen):

```html
<!-- megrendelo.html: a <form> nyitótagra -->
<form id="megrendelo-urlap" class="order-layout" action="kuldes.php" method="post">
```
és töröld a `main.js` végéről a `form.addEventListener('submit', ...)` blokkot.

Alternatíva kód nélkül: [Formspree](https://formspree.io) vagy Netlify Forms —
csak az `action` attribútumot kell átírni.

## Árak módosítása

Az árak **három helyen** szerepelnek, mindegyik sima szöveg:

| Hol | Mit |
|---|---|
| `index.html` | a három termékkártya „Ártól / Ár" blokkja |
| `acelvazas-puskaasztal.html` | hossz szerinti árlista táblázat |
| `megrendelo.html` | a `<select id="termek">` opciói — itt a `data-ar="14000"` attribútum vezérli a kalkulátort |

A `data-ar` értéket **mindig** frissítsd az opció szövegével együtt, különben
a kalkulátor mást számol, mint ami ki van írva.

## Az ügyfél (Balogh József) kérései — elvégezve

- ✅ „nem csak vásározóknak" → **„vásározók számára"** (fejléc + lábléc, minden oldalon)
- ✅ Az `asztallap_2023_07.jpg` árlista bekerült az **Asztallapok** oldalra,
  nagyítható (lightbox), plusz a főoldalon is szerepel egy blokk vele.
  Az összes kombinációt HTML-táblázatban is legépeltem — így mobilon olvasható,
  és a Google is indexelni tudja (a képet nem tudja).

## Honnan jön melyik adat (forrásellenőrzés)

Minden ár és műszaki adat a régi oldalról vagy az ügyféltől kapott árlista képről
származik. Nincs kitalált adat. Konkrétan:

| Adat | Forrás |
|---|---|
| Acélvázas hossz/ár lépcső (100/120/150/200/240/300 cm → 10/11/12/14/16/18 e Ft) | régi `/megrendelo/` legördülő, tételesen |
| Alu 200 cm – 16 000 Ft, rozsdamentes 200 cm – 25 000 Ft | régi `/megrendelo/` + termékoldalak |
| Normál 82 cm / Félmagas 50 cm | régi `/megrendelo/` magasság választó |
| „félmagas (50 cm)", 1 / 1,5 / 3 / 4,5 m szélesség | régi főoldal szövege |
| Asztallap 50×100 = 1 500 Ft, 100×100 = 3 000 Ft | régi `/osb-lap/` oldal |
| Asztallap 50×83 = 1 250 Ft, 100×83 = 2 500 Ft | **csak** a kapott árlista képen (2023. aug. 1.) |
| Az összes lapkombináció (1 / 1,5 / 2 / 2,4 / 3 m) | a kapott árlista kép, tételesen legépelve |
| Fix 4 000 Ft futár, ROYAL, utánvét | régi főoldal + `/megrendelo/` |
| Teherbírás, súly, méretek típusonként | a három régi termékoldal |

## Amit egyeztetni kell az ügyféllel

1. **Acélvázas ár ellentmondás.** A régi termékoldalon `7 500 Ft` szerepelt,
   a megrendelő űrlapon viszont tételesen 10 000 – 18 000 Ft.
   Az új oldalon a megrendelő űrlap árait vettem alapul (frissebbnek tűnik).
   **Kérdezd meg, melyik az érvényes.**
2. **Magasság: 80 vagy 82 cm?** A régi termékoldalak `80 cm`-t írtak, a megrendelő
   űrlap `Normál 82 cm`-t. Mindkettőt megtartottam a saját helyén (termékoldal 80,
   űrlap 82), de ez így nem konzisztens. Ha megmondja a helyeset, 4 helyen kell átírni:
   a három termékoldal `specs` listája + `megrendelo.html` rádiógomb.
3. **Fotók.** A kapott képeket használtam, de nem tudom biztosan, melyik fotón
   melyik váztípus (acél / alu / rozsdamentes) látható. Kérj tőle egyértelmű
   hozzárendelést, és lehetőleg 1–2 friss, nagy felbontású fotót termékenként.
4. **Asztallap árlista dátuma.** „Érvényes 2023. aug. 1-től" — még aktuális?
5. **Facebook.** A https://www.facebook.com/puskaasztal/ link a láblécben és a
   kapcsolat oldalon szerepel.
6. **Impresszum / ÁSZF / adatkezelési tájékoztató** — webshop-szerű megrendelő
   űrlapnál Magyarországon kötelező. Jelenleg nincs ilyen oldal, érdemes lenne.

## Beépített térkép (kapcsolat.html)

A térkép **kulcs nélküli Google Maps beágyazás** – a címet a Google geokódolja,
nem kell hozzá koordináta és nem kell API-kulcs sem.

**GDPR:** a Google beágyazás sütit tesz le a látogatónál. Ha ezt el akarod kerülni,
cseréld az `iframe` `src`-jét OpenStreetMap-re (ehhez viszont kellenek a pontos
koordináták) – a `kapcsolat.html`-ben ott a kikommentelt minta:

```
https://www.openstreetmap.org/export/embed.html?bbox=LON1,LAT1,LON2,LAT2&layer=mapnik&marker=LAT,LON
```

## Technikai jellemzők

- Reszponzív 320 px-től felfelé, nincs vízszintes görgetés
- WCAG-barát: skip link, `aria-*`, fókusz jelzés, kontrasztos színek, minden képnek alt
- SEO: egyedi title/description oldalanként, canonical, Open Graph,
  JSON-LD (LocalBusiness + Product séma)
- Teljesítmény: nincs jQuery, nincs framework, ~15 KB CSS + ~5 KB JS,
  képek optimalizálva, lazy loading
- Nyomtatásbarát stíluslap (a régi oldal „Print/PDF" gombjait kiváltja)
- Sötét, ipari arculat — a színek egy helyen, a `style.css` tetején
  (`:root` blokk) állíthatók

---
Készítette: Advant · advant.hu
