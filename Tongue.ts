class Tongue {
    private ready: boolean;
    private debug: boolean;
    private languages: any;

    private attemptDone: number;
    public readonly attemptBeforeFail: number = 3;

    constructor(private currentLanguage: string) {
        this.debug = true;
        this.ready = false;
        this.attemptDone = 0;
        this.languages = [];

        this.loadResource( this.currentLanguage );
    }



    /**
    *   @param debug: Boolean
    **/
    public setDebug(debug: boolean): void{
        this.debug = debug;
    }


    private loadJSON(lang: String, callback: any) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'languages/' + lang + '.json', true);

        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == 200) {
                // Required use of an anonymous callback
                // as .open() will NOT return a value but simply returns undefined
                //in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }

    /**
    *   Write each translation for each balise
    *   automatically called after loading language
    **/
    public update(){

        if( this.currentLanguage != undefined &&
            this.languages != undefined &&
            this.ready
        ){

            //get each prefix of every translation

            var prefixs = [];
            var translation = this.languages[this.currentLanguage].translation;
            for (var prefix in translation) {
                const currentPrefix = prefix.substring(0, prefix.indexOf("."));
                if (prefixs.indexOf(currentPrefix) < 0 &&
                currentPrefix.length > 0) {
                    //add
                    prefixs.push(currentPrefix);
                }
            }
            if( this.debug ){
                var elems = document.body.getElementsByTagName("*");

                for (var p = 0; p < prefixs.length; p++) {
                    for (var e = 0; e < elems.length; e++) {

                        if ( elems[e].className.indexOf(prefixs[ p ]) >= 0) {

                            // if (elems[e].innerHTML == '') {
                                elems[ e ].innerHTML = '<span class="tongue-error" style="background-color:red;padding:5px;white-space: pre-wrap;">[TONGUE] missing value: <span style="text-transform:uppercase;">(' + this.currentLanguage + '</span>) ' + elems[e].className + '</span>';
                                //elems[ e ].className += ' tongue-missing-value';
                            // }

                        }
                    }
                }
            }

            for(let translation in this.languages[ this.currentLanguage ].translation ){
                const classArray = document.getElementsByClassName( translation );
                for(var c = 0; c < classArray.length; c++){
                    const str = this.languages[ this.currentLanguage ].translation[ translation ].replace(/(?:\r\n|\r|\n)/g, '<br />');
                    classArray[ c ].innerHTML = str;
                }
            }

        }else if( ! this.ready ){
            this.tryUpdate();
        }
    }

    /**
    *   Change the language,
    *   if this one is already downloaded
    *   do only an update,
    *   else the resource
    **/
    public switchLanguage(lang: string){
        if( this.currentLanguage == lang ){
            return;
        }
        this.currentLanguage = lang;
        if( this.languages[ lang ] != undefined ){
            this.update();
        }else{
            this.loadResource( this.currentLanguage );
        }

    }

    /**
    *   Fetch the lang
    *   set ready true when resource is loaded
    *   then call update, to refresh the text on the page
    **/
    private loadResource(lang: string){
        //save context
        this.ready = false;
        let self = this;
        this.loadJSON(lang, function(response: any) {
            // Parse JSON string into object
            self.languages[ self.currentLanguage ] = JSON.parse( response );
            self.ready = true;
            self.update();
        });
    }

    /**
    *   Try do update function
    *   until attemptDone are consumed
    *   are ready will be true
    *
    **/
    private tryUpdate(){
        let self = this;
        setTimeout(function(){
            if( self.attemptDone == self.attemptBeforeFail ){
                self.printError( "[TONGUE]: cannot update, missing resource: " + self.currentLanguage + ".json" );
                return;
            }
            if( self.ready ){
                self.update();
            }else{
                //trying recall update later
                self.tryUpdate();
            }
            self.attemptDone++;
        }, 1500);
    }

    private printError(message: string){
        if( this.debug ){
            console.error( message );
        }
    }

}