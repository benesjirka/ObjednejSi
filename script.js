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
var NabidkaPolozky = /** @class */ (function () {
    function NabidkaPolozky(nazev, zakladniCena, mnozstvi) {
        this._mnozstvi = 0; // podtržítko!
        this.nazev = nazev;
        this.zakladniCena = zakladniCena;
        this.mnozstvi = mnozstvi; // zavolá setter
    }
    Object.defineProperty(NabidkaPolozky.prototype, "mnozstvi", {
        get: function () {
            return this._mnozstvi; // podtržítko!
        },
        set: function (hodnota) {
            if (hodnota < 1) {
                this._mnozstvi = 1; // podtržítko!
                console.error("Množství nesmí být menší než 1!");
            }
            else {
                this._mnozstvi = hodnota; // podtržítko!
            }
        },
        enumerable: false,
        configurable: true
    });
    NabidkaPolozky.prototype.getNazev = function () {
        return this.nazev;
    };
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
// Třída Kosik – spravuje objednávku a seznam položek
var Kosik = /** @class */ (function () {
    function Kosik() {
        this.polozky = [];
    }
    // Přidá položku do košíku
    Kosik.prototype.pridatPolozku = function (polozka) {
        this.polozky.push(polozka);
    };
    // Vrátí celkovou cenu všech položek bez DPH
    Kosik.prototype.getCelkem = function () {
        var sum = 0;
        for (var _i = 0, _a = this.polozky; _i < _a.length; _i++) {
            var polozka = _a[_i];
            sum += polozka.getCelkovaCena();
        }
        return sum;
    };
    // Vrátí celkovou cenu včetně DPH
    Kosik.prototype.getCelkemSDph = function () {
        return this.getCelkem() * 1.21;
    };
    // Vypíše všechny položky a celkovou cenu do konzole
    Kosik.prototype.vypis = function () {
        for (var _i = 0, _a = this.polozky; _i < _a.length; _i++) {
            var polozka = _a[_i];
            console.log(polozka.vypis());
        }
        console.log("--------------------------");
        console.log("Celkem bez DPH: ".concat(this.getCelkem(), " K\u010D"));
        console.log("Celkem s DPH: ".concat(this.getCelkemSDph().toFixed(2), " K\u010D"));
    };
    return Kosik;
}());
// Testování v konzoli
var kosik = new Kosik();
kosik.pridatPolozku(new Jidlo("Smažený sýr", 85, 1, 4, true));
kosik.pridatPolozku(new Jidlo("Kuřecí burger", 120, 1, 4, false));
kosik.pridatPolozku(new Napoj("Kofola 0.5l", 35, 2, 3, false));
kosik.vypis();
