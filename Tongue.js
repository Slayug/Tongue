var Tongue = (function () {
    function Tongue(currentLanguage) {
        this.currentLanguage = currentLanguage;
        this.attemptBeforeFail = 3;
        this.debug = true;
        this.ready = false;
        this.attemptDone = 0;
        this.languages = [];
        this.loadResource(this.currentLanguage);
    }
    Tongue.prototype.setDebug = function (debug) {
        this.debug = debug;
        this.update();
    };
    Tongue.prototype.isDebug = function () {
        return this.debug;
    };
    Tongue.prototype.loadJSON = function (lang, callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'translations/' + lang + '.json', true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == 200) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    };
    Tongue.prototype.update = function () {
        if (this.currentLanguage != undefined &&
            this.languages != undefined &&
            this.ready) {
            var elems = document.body.getElementsByTagName("*");
            for (var e = 0; e < elems.length; e++) {
                var currentTranslation = elems[e].dataset["tongue"];
                if (currentTranslation != undefined) {
                    var str = this.languages[this.currentLanguage].translation[currentTranslation];
                    if (str != undefined) {
                        str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
                        elems[e].innerHTML = str;
                    }
                    else {
                        if (this.debug) {
                            elems[e].innerHTML = '<span class="tongue-error" style="background-color:red;padding:5px;white-space: pre-wrap;">[TONGUE] missing value: <span style="text-transform:uppercase;">(' + this.currentLanguage + '</span>) ' + elems[e].dataset["tongue"] + '</span>';
                        }
                        else {
                            elems[e].innerHTML = '';
                        }
                    }
                }
            }
        }
        else if (!this.ready) {
            this.tryUpdate();
        }
    };
    Tongue.prototype.switchLanguage = function (lang) {
        if (this.currentLanguage == lang) {
            return;
        }
        this.currentLanguage = lang;
        if (this.languages[lang] != undefined) {
            this.update();
        }
        else {
            this.loadResource(this.currentLanguage);
        }
    };
    Tongue.prototype.loadResource = function (lang) {
        this.ready = false;
        var self = this;
        this.loadJSON(lang, function (response) {
            self.languages[self.currentLanguage] = JSON.parse(response);
            self.ready = true;
            self.update();
        });
    };
    Tongue.prototype.tryUpdate = function () {
        var self = this;
        setTimeout(function () {
            if (self.attemptDone == self.attemptBeforeFail) {
                self.printError("[TONGUE]: cannot update, missing resource: " + self.currentLanguage + ".json");
                return;
            }
            if (self.ready) {
                self.update();
            }
            else {
                self.tryUpdate();
            }
            self.attemptDone++;
        }, 1500);
    };
    Tongue.prototype.printError = function (message) {
        if (this.debug) {
            console.error(message);
        }
    };
    return Tongue;
}());
//# sourceMappingURL=Tongue.js.map