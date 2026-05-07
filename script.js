// Abstraktní třída – společný základ pro všechny položky v nabídce
var NabidkaPolozky = /** @class */ (function () {
    // Konstruktor – inicializuje společné vlastnosti všech položek
    function NabidkaPolozky(nazev, zakladniCena, mnozstvi) {
        this.nazev = nazev;
        this.zakladniCena = zakladniCena;
        this.mnozstvi = mnozstvi;
    }
    // Vrátí název položky
    NabidkaPolozky.prototype.getNazev = function () {
        return this.nazev;
    };
    // Vrátí textový popis položky včetně vypočítané ceny
    NabidkaPolozky.prototype.vypis = function () {
        return "".concat(this.nazev, " x ").concat(this.mnozstvi, " \u2014 ").concat(this.getCelkovaCena(), " K\u010D");
    };
    return NabidkaPolozky;
}());
