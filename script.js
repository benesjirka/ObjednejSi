var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
// Třída Jidlo – reprezentuje pokrm v nabídce
var Jidlo = /** @class */ (function (_super) {
    __extends(Jidlo, _super);
    // Konstruktor – inicializuje jídlo včetně vlastních atributů
    function Jidlo(nazev, zakladniCena, mnozstvi, cenaKrabice, jeVege) {
        var _this = _super.call(this, nazev, zakladniCena, mnozstvi) || this;
        _this.cenaKrabice = cenaKrabice;
        _this.jeVege = jeVege;
        return _this;
    }
    // Výpočet ceny – nevege položky mají příplatek 20 %, cena krabice se násobí množstvím
    Jidlo.prototype.getCelkovaCena = function () {
        if (this.jeVege === false) {
            return this.zakladniCena * this.mnozstvi + (this.cenaKrabice * this.mnozstvi);
        }
        else
            return (this.zakladniCena * 1.2) * this.mnozstvi + (this.cenaKrabice * this.mnozstvi);
    };
    return Jidlo;
}(NabidkaPolozky));
// Třída Napoj – reprezentuje nápoj v nabídce
var Napoj = /** @class */ (function (_super) {
    __extends(Napoj, _super);
    // Konstruktor – inicializuje nápoj včetně vlastních atributů
    function Napoj(nazev, zakladniCena, mnozstvi, zalohaZaLahev, jeAlkohol) {
        var _this = _super.call(this, nazev, zakladniCena, mnozstvi) || this;
        _this.zalohaZaLahev = zalohaZaLahev;
        _this.jeAlkohol = jeAlkohol;
        return _this;
    }
    // Výpočet ceny – základní cena krát množství plus záloha za každou lahev
    Napoj.prototype.getCelkovaCena = function () {
        return this.zakladniCena * this.mnozstvi + (this.zalohaZaLahev * this.mnozstvi);
    };
    return Napoj;
}(NabidkaPolozky));
