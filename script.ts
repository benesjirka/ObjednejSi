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

