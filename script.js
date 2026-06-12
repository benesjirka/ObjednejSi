import { katalog } from "./data.js";
// Abstraktní základní třída – společný základ pro všechny položky nabídky
class NabidkaPolozky {
    constructor(nazev, zakladniCena, mnozstvi) {
        this._mnozstvi = 0; // Interní úložiště množství (kvůli setteru)
        this.nazev = nazev;
        this.zakladniCena = zakladniCena;
        this.mnozstvi = mnozstvi; // Zavolá setter, který provede validaci
    }
    // Setter – hlídá, aby množství nikdy nekleslo pod 1
    set mnozstvi(hodnota) {
        if (hodnota < 1) {
            this._mnozstvi = 1;
            console.error("Množství nesmí být menší než 1!");
        }
        else {
            this._mnozstvi = hodnota;
        }
    }
    // Getter – vrátí aktuální množství
    get mnozstvi() {
        return this._mnozstvi;
    }
    // Vrátí název položky
    getNazev() {
        return this.nazev;
    }
    // Vrátí textový výpis položky s množstvím a cenou
    vypis() {
        return `${this.nazev} x ${this.mnozstvi} - ${this.getCelkovaCena()} Kč`;
    }
}
// Třída Jidlo – reprezentuje pokrm v nabídce
class Jidlo extends NabidkaPolozky {
    constructor(nazev, zakladniCena, mnozstvi, cenaKrabice, jeVege) {
        super(nazev, zakladniCena, mnozstvi);
        this.cenaKrabice = cenaKrabice;
        this.jeVege = jeVege;
    }
    // Výpočet ceny:
    // – nevege: základní cena × množství + cena krabice × množství
    // – vege: (základní cena × 1,2) × množství + cena krabice × množství
    // Vegetariánská varianta je dražší o 20 %, protože používá speciální
    // suroviny (sýry, luštěniny, zeleninu) které jsou nákladnější než maso
    getCelkovaCena() {
        if (this.jeVege === false) {
            return this.zakladniCena * this.mnozstvi + (this.cenaKrabice * this.mnozstvi);
        }
        return (this.zakladniCena * 1.2) * this.mnozstvi + (this.cenaKrabice * this.mnozstvi);
    }
    // Getter pro cenu krabice – potřebný pro výpis v košíku
    getCenaKrabice() {
        return this.cenaKrabice;
    }
}
// Třída Napoj – reprezentuje nápoj v nabídce
// Záloha za lahev byla odstraněna – cena je pouze základní cena × množství
class Napoj extends NabidkaPolozky {
    constructor(nazev, zakladniCena, mnozstvi, jeAlkohol) {
        super(nazev, zakladniCena, mnozstvi);
        this.jeAlkohol = jeAlkohol;
    }
    // Výpočet ceny: základní cena × množství
    getCelkovaCena() {
        return this.zakladniCena * this.mnozstvi;
    }
}
// Třída Dezert – dědí přímo od NabidkaPolozky (stejně jako Jidlo a Napoj)
// Dezerty mají vlastní logiku – cenu krabice, ale nemají vege variantu
class Dezert extends NabidkaPolozky {
    constructor(nazev, zakladniCena, mnozstvi, cenaKrabice) {
        super(nazev, zakladniCena, mnozstvi);
        this.cenaKrabice = cenaKrabice;
    }
    // Výpočet ceny: základní cena × množství + cena krabice × množství
    // Dezerty nemají vege variantu – cena je vždy pevná
    getCelkovaCena() {
        return this.zakladniCena * this.mnozstvi + (this.cenaKrabice * this.mnozstvi);
    }
    // Getter pro cenu krabice – potřebný pro výpis v košíku
    getCenaKrabice() {
        return this.cenaKrabice;
    }
}
// Třída Kosik – spravuje seznam objednaných položek
class Kosik {
    constructor() {
        this.polozky = []; // Pole všech přidaných položek
    }
    // Přidá položku na konec košíku
    pridatPolozku(polozka) {
        this.polozky.push(polozka);
    }
    // Vrátí celé pole položek (pro vykreslení v UI)
    getPolozky() {
        return this.polozky;
    }
    // Odebere položku podle indexu v poli
    odebratPolozku(index) {
        this.polozky.splice(index, 1);
    }
    // Vyprázdní celý košík
    vymazat() {
        this.polozky = [];
    }
    // Vrátí celkovou cenu bez DPH
    // Polymorfismus: getCelkovaCena() se zavolá správně pro Jidlo, Dezert i Napoj
    getCelkem() {
        let sum = 0;
        for (const polozka of this.polozky) {
            sum += polozka.getCelkovaCena();
        }
        return sum;
    }
    // Vrátí celkovou cenu včetně DPH (21 %)
    getCelkemSDph() {
        return this.getCelkem() * 1.21;
    }
}
// Tovární funkce – vytvoří správnou instanci třídy podle typu položky v katalogu
function vytvorPolozku(nazev, mnozstvi, jeVege) {
    var _a, _b, _c;
    // Najde položku v katalogu podle názvu
    const data = katalog.find(item => item.nazev === nazev);
    if (!data)
        throw new Error(`Položka "${nazev}" nebyla nalezena v katalogu`);
    if (data.typ === "jidlo") {
        return new Jidlo(data.nazev, data.zakladniCena, mnozstvi, (_a = data.cenaKrabice) !== null && _a !== void 0 ? _a : 0, jeVege !== null && jeVege !== void 0 ? jeVege : false);
    }
    else if (data.typ === "dezert") {
        // Dezert nemá vege variantu – jeVege se nepředává
        return new Dezert(data.nazev, data.zakladniCena, mnozstvi, (_b = data.cenaKrabice) !== null && _b !== void 0 ? _b : 0);
    }
    else {
        // Nápoje berou jeAlkohol přímo z katalogu, záloha za lahev byla odstraněna
        return new Napoj(data.nazev, data.zakladniCena, mnozstvi, (_c = data.jeAlkohol) !== null && _c !== void 0 ? _c : false);
    }
}
// Globální instance košíku – sdílená napříč celou aplikací
const kosik = new Kosik();
// Vykreslí všechny položky z katalogu jako karty do příslušných sekcí
function renderKatalog() {
    const sekceJidla = document.getElementById('sekce-jidla');
    const sekceDezerty = document.getElementById('sekce-dezerty');
    const sekceNapoje = document.getElementById('sekce-napoje');
    katalog.forEach(item => {
        const jeJidlo = item.typ === 'jidlo';
        const jeDezert = item.typ === 'dezert';
        const jeNapoj = item.typ === 'napoj';
        // Každá karta zabere půl šířky na středních+ obrazovkách
        const col = document.createElement('div');
        col.className = 'w3-col s12 m6';
        // Badge se zobrazí jen u položek s vegetariánskou volbou nebo u nápojů
        const nazevBadge = jeJidlo && item.jeVegeVolba
            ? `<span class="polozka-badge badge-vege">vege volitelné</span>`
            : jeNapoj && item.jeAlkohol
                ? `<span class="polozka-badge badge-alkohol">alkohol</span>`
                : jeNapoj
                    ? `<span class="polozka-badge badge-bezalkohol">bez alkoholu</span>`
                    : '';
        // Checkbox pro vege volbu se zobrazí jen u jídel s jeVegeVolba: true
        // Dezerty vege variantu nemají
        const vegeCb = jeJidlo && item.jeVegeVolba
            ? `<label class="vege-label">
                <input type="checkbox" id="vege-${item.nazev}"> vegetariánská volba (+20 %)
               </label>`
            : '';
        col.innerHTML = `
        <div class="polozka-card">
            <p class="polozka-nazev">${item.nazev} ${nazevBadge}</p>
            <p class="polozka-cena">${item.zakladniCena} Kč</p>
            ${vegeCb}
            <div class="mnozstvi-wrapper">
                <button class="mnozstvi-btn" onclick="zmenMnozstvi('${item.nazev}', -1)">−</button>
                <input class="mnozstvi-input" type="number" id="mn-${item.nazev}" value="1" min="1">
                <button class="mnozstvi-btn" onclick="zmenMnozstvi('${item.nazev}', 1)">+</button>
            </div>
            <button class="pridat-btn" onclick="pridatDoKosiku('${item.nazev}', '${item.typ}')">
                + Přidat do košíku
            </button>
        </div>`;
        // Vloží kartu do správné sekce podle typu
        if (jeJidlo)
            sekceJidla.appendChild(col);
        else if (jeDezert)
            sekceDezerty.appendChild(col);
        else
            sekceNapoje.appendChild(col);
    });
}
// Změní množství u dané položky pomocí tlačítek + a −
function zmenMnozstvi(nazev, delta) {
    const input = document.getElementById(`mn-${nazev}`);
    const nova = Math.max(1, parseInt(input.value) + delta); // Minimum je vždy 1
    input.value = String(nova);
}
// Přečte hodnoty z UI, vytvoří instanci položky a přidá ji do košíku
function pridatDoKosiku(nazev, typ) {
    const mnozstvi = parseInt(document.getElementById(`mn-${nazev}`).value);
    let jeVege = false;
    // Vege volbu čteme jen u jídel – dezerty ji nemají
    if (typ === 'jidlo') {
        const cb = document.getElementById(`vege-${nazev}`);
        if (cb)
            jeVege = cb.checked;
    }
    kosik.pridatPolozku(vytvorPolozku(nazev, mnozstvi, jeVege));
    renderKosik(); // Překreslí košík po přidání
}
// Odebere položku z košíku podle indexu a překreslí košík
function odebratPolozku(index) {
    kosik.odebratPolozku(index);
    renderKosik();
}
// Překreslí celý košík – tabulku položek, součty a badge s počtem
function renderKosik() {
    const tbody = document.getElementById('kosik-tbody');
    const prazdny = document.getElementById('kosik-prazdny');
    const polozkyDiv = document.getElementById('kosik-polozky');
    const polozky = kosik.getPolozky();
    // Prázdný košík – zobrazí placeholder, skryje tabulku
    if (polozky.length === 0) {
        prazdny.classList.remove('w3-hide');
        polozkyDiv.classList.add('w3-hide');
        document.getElementById('kosik-pocet').textContent = '0';
        return;
    }
    // Neprázdný košík – skryje placeholder, zobrazí tabulku
    prazdny.classList.add('w3-hide');
    polozkyDiv.classList.remove('w3-hide');
    // Vykreslí řádky tabulky košíku
    tbody.innerHTML = '';
    polozky.forEach((p, i) => {
        const tr = document.createElement('tr');
        // Jidlo i Dezert mají getCenaKrabice() – zobrazí cenu krabice pod názvem
        const krabiceInfo = (p instanceof Jidlo || p instanceof Dezert)
            ? `<br><span style="font-size:0.75rem; color:#888;">+ krabice: ${p.getCenaKrabice() * p.mnozstvi} Kč</span>`
            : '';
        tr.innerHTML = `
            <td class="kosik-nazev">${p.getNazev()}${krabiceInfo}</td>
            <td class="w3-center">${p.mnozstvi}</td>
            <td class="w3-right-align">${p.getCelkovaCena()} Kč</td>
            <td><button class="odebrat-btn" onclick="odebratPolozku(${i})">✕</button></td>`;
        tbody.appendChild(tr);
    });
    // Aktualizuje součty v patičce košíku
    const bezDph = kosik.getCelkem();
    const sDph = kosik.getCelkemSDph();
    document.getElementById('celkem-bez-dph').textContent = bezDph + ' Kč';
    document.getElementById('vyse-dph').textContent = (sDph - bezDph).toFixed(2) + ' Kč';
    document.getElementById('celkem-s-dph').textContent = sDph.toFixed(2) + ' Kč';
    document.getElementById('kosik-pocet').textContent = String(polozky.length);
}
// Zpřístupní funkce globálně – nutné pro inline onclick handlery v HTML
window.zmenMnozstvi = zmenMnozstvi;
window.pridatDoKosiku = pridatDoKosiku;
window.odebratPolozku = odebratPolozku;
// Zobrazí potvrzovací banner na 3 sekundy po kliknutí na Objednat
window.objednat = function () {
    const banner = document.getElementById('objednano-banner');
    banner.classList.remove('w3-hide');
    setTimeout(() => banner.classList.add('w3-hide'), 3000);
};
// Vyprázdní košík a překreslí UI
window.vymazatKosik = function () {
    kosik.vymazat();
    renderKosik();
};
// Spustí vykreslení katalogu ihned po načtení stránky
renderKatalog();
