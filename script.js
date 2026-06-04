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
