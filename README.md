# Tongue
Manage yours translations dynamically on your website. No reload page !

<h2><a href="http://buuuuug.ddns.net/tongue/">=> DEMO <=</a></h2>

You can use the TypeScript version or the prototype js.

Example on the index.html<br>
Summary<br>
Instantiate the class: tongue = new Tongue('en');<br>
You can easily change the translation with: tongue.switchLanguage('fr');<br>
Put yours translations in translations folder.
Make the link with yours translations on balise: &#60;p class="word.toast"&#62;&#60;/p&#62;

** If you change something dynamically on your page, with some text, you should update the translation **<br>
tongue.update();<br>

Debug mode show you if there is a missing translation.
By default debug mode is enable. You can change it by two ways:
  - tongue.setDebug( false );
  - Or directly in the class file, in constructor.


TODO:
Get the translation from the url, navigator language.
