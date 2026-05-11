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
        return `${this.nazev} x ${this.mnozstvi} — ${this.getCelkovaCena()} Kč`;
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

    // Vrátí celkovou cenu všech položek bez DPH
    getCelkem(): number {
        let sum = 0;
        for (const polozka of this.polozky) {
            sum += polozka.getCelkovaCena();
        }
        return sum;
    }

    // Vrátí celkovou cenu včetně DPH
    getCelkemSDph(): number {
        return this.getCelkem() * 1.21;
    }

    // Vypíše všechny položky a celkovou cenu do konzole
    vypis(): void {
        for (const polozka of this.polozky) {
            console.log(polozka.vypis());
        }
        console.log("--------------------------");
        console.log(`Celkem bez DPH: ${this.getCelkem()} Kč`);
        console.log(`Celkem s DPH: ${this.getCelkemSDph().toFixed(2)} Kč`);
    }
}

// Testování v konzoli
const kosik = new Kosik();

kosik.pridatPolozku(new Jidlo("Smažený sýr", 85, 2, 4, true));
kosik.pridatPolozku(new Jidlo("Kuřecí burger", 120, 1, 4, false));
kosik.pridatPolozku(new Napoj("Kofola 0.5l", 35, 2, 3, false));

kosik.vypis();

function vytvorPolozku(nazev: string, mnozstvi: number, jeVege?: boolean, jeAlkohol?: boolean): NabidkaPolozky {
    const data = katalog.find(item => item.nazev === nazev);
    if (!data) throw new Error(`Položka "${nazev}" nebyla nalezena v katalogu`);

    if (data.typ === "jidlo") {
        return new Jidlo(data.nazev, data.zakladniCena, mnozstvi, data.cenaKrabice ?? 0, jeVege ?? false);
    } else {
        return new Napoj(data.nazev, data.zakladniCena, mnozstvi, data.zalohaZaLahev ?? 0, jeAlkohol ?? false);
    }
}

new Jidlo("Smažený sýr", 85, 2, 4, true)