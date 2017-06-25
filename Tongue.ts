class Tongue {
    private ready: boolean;
    private debug: boolean;
    private languages: any;


    private attemptDone: number;
    public readonly attemptBeforeFail: number = 3;

    constructor(
        private defaultLanguage?: string,
        private currentLanguage?: string
    ) {
        this.debug = true;
        this.ready = false;
        this.attemptDone = 0;
        this.languages = [];

        if( this.currentLanguage === undefined ){
            //get language from browser
            this.currentLanguage = navigator.language || navigator.userLanguage;
        }
        if( this.currentLanguage === undefined ){
            //navigator don't give any information try to reach en translations
            this.currentLanguage = 'en';
        }
        this.loadResource( this.currentLanguage );
    }

    public setDefaultLanguage( language: string ){
        this.defaultLanguage = language;
    }

    public getDefaultLanguage( ): string{
        return this.defaultLanguage;
    }



    /**
    *   @param debug: Boolean
    **/
    public setDebug(debug: boolean): void{
        this.debug = debug;
        this.update();
    }

    public isDebug(): boolean{
        return this.debug;
    }


    private loadJSON(lang: String, callback: any) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'translations/' + lang + '.json', true);
        var self = this;
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == 200) {
                // Required use of an anonymous callback
                // as .open() will NOT return a value but simply returns undefined
                //in asynchronous mode
                callback(xobj.responseText);
            }else if( xobj.status == 404 ){
                //resource not found
                if( self.currentLanguage.indexOf( '-' ) != -1 ){
                    //try to reach the default language for this translation
                    self.printDebug("[" + self.currentLanguage + "] not found, try to download ["+ self.currentLanguage.split( '-' )[ 0 ] + "].");
                    self.switchLanguage( self.currentLanguage.split( '-' )[ 0 ] );
                }else{
                    //guess already try sub translation
                    //now try default language if not undefined
                    if( self.defaultLanguage != undefined ){
                        self.switchLanguage( self.defaultLanguage );
                    }
                }
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
            //fetch all elements
            var elems = document.body.getElementsByTagName("*");

            for (var e = 0; e < elems.length; e++) {

                //ignore warning from typescript
                const currentTranslation = (elems[ e ] as any).dataset[ "tongue" ];
                //select only elements who have tongue data
                if ( currentTranslation != undefined ) {

                    let str = this.languages[ this.currentLanguage ].translation[ currentTranslation ];
                    //if the translation is available
                    if( str != undefined ){
                        str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
                        elems[ e ].innerHTML = str;
                    }else{
                        if ( this.debug ) {
                            elems[ e ].innerHTML = '<span class="tongue-error" style="background-color:red;padding:5px;white-space: pre-wrap;">[TONGUE] missing value: <span style="text-transform:uppercase;">(' + this.currentLanguage + '</span>) ' + (elems[ e ] as any).dataset[ "tongue" ] + '</span>';
                            //elems[ e ].className += ' tongue-missing-value';
                        }else{
                            elems[ e ].innerHTML = '';
                        }
                    }
                }

                //ignore warning from typescript
                const currentFlag = (elems[ e ] as any).dataset[ "tongueFlag" ];
                if( currentFlag != undefined ){
                    //canceled link classed by tongueFlag
                    (elems[ e ] as any).onclick = function(){
                        return false;
                    };
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
            self.printDebug("success loading: " + self.currentLanguage );
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
        if( self.languages[ self.currentLanguage ] != null ){
            self.ready = true;
            self.update();
            return;
        }
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

    private printDebug(message: string): void{
        if( this.debug ){
            console.log('[DEBUG] ' + message );
        }
    }

}
