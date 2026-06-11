import { katalog } from "./data.js";
class NabidkaPolozky {
    constructor(nazev, zakladniCena, mnozstvi) {
        this._mnozstvi = 0; // podtržítko!
        this.nazev = nazev;
        this.zakladniCena = zakladniCena;
        this.mnozstvi = mnozstvi; // zavolá setter
    }
    set mnozstvi(hodnota) {
        if (hodnota < 1) {
            this._mnozstvi = 1; // podtržítko!
            console.error("Množství nesmí být menší než 1!");
        }
        else {
            this._mnozstvi = hodnota; // podtržítko!
        }
    }
    get mnozstvi() {
        return this._mnozstvi; // podtržítko!
    }
    getNazev() {
        return this.nazev;
    }
    vypis() {
        return `${this.nazev} x ${this.mnozstvi} -   ${this.getCelkovaCena()} Kč`;
    }
}
// Třída Jidlo – reprezentuje pokrm v nabídce
class Jidlo extends NabidkaPolozky {
    // Konstruktor – inicializuje jídlo včetně vlastních atributů
    constructor(nazev, zakladniCena, mnozstvi, cenaKrabice, jeVege) {
        super(nazev, zakladniCena, mnozstvi);
        this.cenaKrabice = cenaKrabice;
        this.jeVege = jeVege;
    }
    // Výpočet ceny – nevege položky mají příplatek 20 %, cena krabice se násobí množstvím
    getCelkovaCena() {
        if (this.jeVege === false) {
            return this.zakladniCena * this.mnozstvi + (this.cenaKrabice * this.mnozstvi);
        }
        else
            return (this.zakladniCena * 1.2) * this.mnozstvi + (this.cenaKrabice * this.mnozstvi);
    }
}
// Třída Napoj – reprezentuje nápoj v nabídce
class Napoj extends NabidkaPolozky {
    // Konstruktor – inicializuje nápoj včetně vlastních atributů
    constructor(nazev, zakladniCena, mnozstvi, zalohaZaLahev, jeAlkohol) {
        super(nazev, zakladniCena, mnozstvi);
        this.zalohaZaLahev = zalohaZaLahev;
        this.jeAlkohol = jeAlkohol;
    }
    // Výpočet ceny – základní cena krát množství plus záloha za každou lahev
    getCelkovaCena() {
        return this.zakladniCena * this.mnozstvi + (this.zalohaZaLahev * this.mnozstvi);
    }
}
// Třída Kosik – spravuje objednávku a seznam položek
class Kosik {
    constructor() {
        this.polozky = [];
    }
    // Přidá položku do košíku
    pridatPolozku(polozka) {
        this.polozky.push(polozka);
    }
    // Vrátí pole všech položek
    getPolozky() {
        return this.polozky;
    }
    // Odebere položku podle indexu
    odebratPolozku(index) {
        this.polozky.splice(index, 1);
    }
    // Vyprázdní celý košík
    vymazat() {
        this.polozky = [];
    }
    // Vrátí celkovou cenu všech položek bez DPH
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
// Pomocná funkce – vytvoří instanci správné třídy podle dat z katalogu
// nazev: název položky z katalogu, mnozstvi: počet kusů, jeVege: volitelné (pouze pro jídla)
function vytvorPolozku(nazev, mnozstvi, jeVege) {
    var _a, _b, _c;
    // Najde položku v katalogu podle názvu
    const data = katalog.find(item => item.nazev === nazev);
    // Pokud položka neexistuje, vyhodí chybu
    if (!data)
        throw new Error(`Položka "${nazev}" nebyla nalezena v katalogu`);
    if (data.typ === "jidlo") {
        // Vytvoří instanci Jidlo – jeVege bere od uživatele, ostatní data z katalogu
        return new Jidlo(data.nazev, data.zakladniCena, mnozstvi, (_a = data.cenaKrabice) !== null && _a !== void 0 ? _a : 0, jeVege !== null && jeVege !== void 0 ? jeVege : false);
    }
    else {
        // Vytvoří instanci Napoj – jeAlkohol bere přímo z katalogu
        return new Napoj(data.nazev, data.zakladniCena, mnozstvi, (_b = data.zalohaZaLahev) !== null && _b !== void 0 ? _b : 0, (_c = data.jeAlkohol) !== null && _c !== void 0 ? _c : false);
    }
}
// DOM – propojení s uživatelským rozhraním
const kosik = new Kosik();
// Vykreslí všechny položky z katalogu jako karty do sekce Jídla / Nápoje
function renderKatalog() {
    const sekceJidla = document.getElementById('sekce-jidla');
    const sekceNapoje = document.getElementById('sekce-napoje');
    katalog.forEach(item => {
        const jeJidlo = item.typ === 'jidlo';
        const col = document.createElement('div');
        col.className = 'w3-col s12 m6';
        // Badge podle typu polozky
        const nazevBadge = jeJidlo && item.jeVegeVolba
            ? `<span class="polozka-badge badge-vege">vege volitelné</span>`
            : !jeJidlo && item.jeAlkohol
                ? `<span class="polozka-badge badge-alkohol">alkohol</span>`
                : !jeJidlo
                    ? `<span class="polozka-badge badge-bezalkohol">bez alkoholu</span>`
                    : '';
        // Checkbox pro vegetariánskou volbu (pouze u jídel)
        // PO:
        const vegeCb = item.jeVegeVolba
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
        (jeJidlo ? sekceJidla : sekceNapoje).appendChild(col);
    });
}
// Změní množství u dané položky v katalogu (tlačítka + a −)
function zmenMnozstvi(nazev, delta) {
    const input = document.getElementById(`mn-${nazev}`);
    const nova = Math.max(1, parseInt(input.value) + delta);
    input.value = String(nova);
}
// Přidá položku do košíku a překreslí košík
function pridatDoKosiku(nazev, typ) {
    const mnozstvi = parseInt(document.getElementById(`mn-${nazev}`).value);
    let jeVege = false;
    if (typ === 'jidlo') {
        const cb = document.getElementById(`vege-${nazev}`);
        if (cb)
            jeVege = cb.checked;
    }
    kosik.pridatPolozku(vytvorPolozku(nazev, mnozstvi, jeVege));
    renderKosik();
}
// Odebere položku z košíku podle indexu a překreslí košík
function odebratPolozku(index) {
    kosik.odebratPolozku(index);
    renderKosik();
}
// Překreslí celý košík – položky, součty, badge s počtem
function renderKosik() {
    const tbody = document.getElementById('kosik-tbody');
    const prazdny = document.getElementById('kosik-prazdny');
    const polozkyDiv = document.getElementById('kosik-polozky');
    const polozky = kosik.getPolozky();
    if (polozky.length === 0) {
        prazdny.classList.remove('w3-hide');
        polozkyDiv.classList.add('w3-hide');
        document.getElementById('kosik-pocet').textContent = '0';
        return;
    }
    prazdny.classList.add('w3-hide');
    polozkyDiv.classList.remove('w3-hide');
    // Vykreslí řádky tabulky košíku
    tbody.innerHTML = '';
    polozky.forEach((p, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="kosik-nazev">${p.getNazev()}</td>
            <td class="w3-center">${p.mnozstvi}</td>
            <td class="w3-right-align">${p.getCelkovaCena()} Kč</td>
            <td><button class="odebrat-btn" onclick="odebratPolozku(${i})">✕</button></td>`;
        tbody.appendChild(tr);
    });
    // Aktualizuje součty
    const bezDph = kosik.getCelkem();
    const sDph = kosik.getCelkemSDph();
    document.getElementById('celkem-bez-dph').textContent = bezDph + ' Kč';
    document.getElementById('vyse-dph').textContent = (sDph - bezDph).toFixed(2) + ' Kč';
    document.getElementById('celkem-s-dph').textContent = sDph.toFixed(2) + ' Kč';
    document.getElementById('kosik-pocet').textContent = String(polozky.length);
}
// Zpřístupní funkce globálně pro inline onclick handlery v HTML
window.zmenMnozstvi = zmenMnozstvi;
window.pridatDoKosiku = pridatDoKosiku;
window.odebratPolozku = odebratPolozku;
window.objednat = function () {
    const banner = document.getElementById('objednano-banner');
    banner.classList.remove('w3-hide');
    setTimeout(() => banner.classList.add('w3-hide'), 3000);
};
window.vymazatKosik = function () {
    kosik.vymazat();
    renderKosik();
};
// Spustí vykreslení katalogu po načtení stránky
renderKatalog();
