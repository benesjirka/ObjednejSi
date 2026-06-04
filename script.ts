import { katalog } from "./data.js";

abstract class NabidkaPolozky {
    protected nazev: string;
    protected zakladniCena: number;
    protected _mnozstvi: number = 0;  // podtržítko!

    constructor(nazev: string, zakladniCena: number, mnozstvi: number) {
        this.nazev = nazev;
        this.zakladniCena = zakladniCena;
        this.mnozstvi = mnozstvi; // zavolá setter
    }

    set mnozstvi(hodnota: number) {
        if (hodnota < 1) {
            this._mnozstvi = 1;  // podtržítko!
            console.error("Množství nesmí být menší než 1!");
        } else {
            this._mnozstvi = hodnota;  // podtržítko!
        }
    }

    get mnozstvi(): number {
        return this._mnozstvi;  // podtržítko!
    }

    getNazev(): string {
        return this.nazev;
    }

    vypis(): string {
        return `${this.nazev} x ${this.mnozstvi} -   ${this.getCelkovaCena()} Kč`;
    }

    abstract getCelkovaCena(): number;
}

// Třída Jidlo – reprezentuje pokrm v nabídce
class Jidlo extends NabidkaPolozky {
    private cenaKrabice: number;  // Příplatek za jednorázový obal
    private jeVege: boolean;      // Zda je pokrm vegetariánský

    // Konstruktor – inicializuje jídlo včetně vlastních atributů
    constructor(nazev: string, zakladniCena: number, mnozstvi: number, cenaKrabice: number, jeVege: boolean) {
        super(nazev, zakladniCena, mnozstvi);
        this.cenaKrabice = cenaKrabice;
        this.jeVege = jeVege;
    }

    // Výpočet ceny – nevege položky mají příplatek 20 %, cena krabice se násobí množstvím
    getCelkovaCena(): number {
        if (this.jeVege === false) {
            return this.zakladniCena * this.mnozstvi + (this.cenaKrabice * this.mnozstvi);
        }
        else return (this.zakladniCena * 1.2) * this.mnozstvi + (this.cenaKrabice * this.mnozstvi);
    }
}

// Třída Napoj – reprezentuje nápoj v nabídce
class Napoj extends NabidkaPolozky {
    private zalohaZaLahev: number;  // Záloha za lahev účtovaná za každý kus
    private jeAlkohol: boolean;     // Zda je nápoj alkoholický

    // Konstruktor – inicializuje nápoj včetně vlastních atributů
    constructor(nazev: string, zakladniCena: number, mnozstvi: number, zalohaZaLahev: number, jeAlkohol: boolean) {
        super(nazev, zakladniCena, mnozstvi);
        this.zalohaZaLahev = zalohaZaLahev;
        this.jeAlkohol = jeAlkohol;
    }

    // Výpočet ceny – základní cena krát množství plus záloha za každou lahev
    getCelkovaCena(): number {
        return this.zakladniCena * this.mnozstvi + (this.zalohaZaLahev * this.mnozstvi);
    }
}

// Třída Kosik – spravuje objednávku a seznam položek

class Kosik {
    private polozky: NabidkaPolozky[] = [];
 
    // Přidá položku do košíku
    pridatPolozku(polozka: NabidkaPolozky): void {
        this.polozky.push(polozka);
    }
 
    // Vrátí pole všech položek
    getPolozky(): NabidkaPolozky[] {
        return this.polozky;
    }
 
    // Odebere položku podle indexu
    odebratPolozku(index: number): void {
        this.polozky.splice(index, 1);
    }
 
    // Vyprázdní celý košík
    vymazat(): void {
        this.polozky = [];
    }
 
    // Vrátí celkovou cenu všech položek bez DPH
    getCelkem(): number {
        let sum = 0;
        for (const polozka of this.polozky) {
            sum += polozka.getCelkovaCena();
        }
        return sum;
    }
 
    // Vrátí celkovou cenu včetně DPH (21 %)
    getCelkemSDph(): number {
        return this.getCelkem() * 1.21;
    }
}
 
// Pomocná funkce – vytvoří instanci správné třídy podle dat z katalogu
// nazev: název položky z katalogu, mnozstvi: počet kusů, jeVege: volitelné (pouze pro jídla)
function vytvorPolozku(nazev: string, mnozstvi: number, jeVege?: boolean): NabidkaPolozky {
    
    // Najde položku v katalogu podle názvu
    const data = katalog.find(item => item.nazev === nazev);
    
    // Pokud položka neexistuje, vyhodí chybu
    if (!data) throw new Error(`Položka "${nazev}" nebyla nalezena v katalogu`);

    if (data.typ === "jidlo") {
        // Vytvoří instanci Jidlo – jeVege bere od uživatele, ostatní data z katalogu
        return new Jidlo(data.nazev, data.zakladniCena, mnozstvi, data.cenaKrabice ?? 0, jeVege ?? false);
    } else {
        // Vytvoří instanci Napoj – jeAlkohol bere přímo z katalogu
        return new Napoj(data.nazev, data.zakladniCena, mnozstvi, data.zalohaZaLahev ?? 0, data.jeAlkohol ?? false);
    }
}
