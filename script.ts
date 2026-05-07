// Abstraktní třída – společný základ pro všechny položky v nabídce
abstract class NabidkaPolozky {
    protected nazev: string;          // Název položky
    protected zakladniCena: number;   // Základní cena za kus
    protected mnozstvi: number;       // Objednané množství

    // Konstruktor – inicializuje společné vlastnosti všech položek
    constructor(nazev: string, zakladniCena: number, mnozstvi: number) {
        this.nazev = nazev;
        this.zakladniCena = zakladniCena;
        this.mnozstvi = mnozstvi;
    }

    // Vrátí název položky
    getNazev(): string {
        return this.nazev;
    }

    // Vrátí textový popis položky včetně vypočítané ceny
    vypis(): string {
        return `${this.nazev} x ${this.mnozstvi} — ${this.getCelkovaCena()} Kč`;
    }

    // Abstraktní metoda – každý potomek musí implementovat vlastní výpočet ceny
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