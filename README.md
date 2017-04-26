# Tongue
Manage yours translations dynamically on your website. No reload page !

<h2><a href="http://buuuuug.ddns.net/tongue/">=> DEMO <=</a></h2>

You can use the TypeScript version or the prototype js.

Example on the index.html<br>
<h4>Summary</h4>
Instantiate the class: tongue = new Tongue('en');<br>
You can easily change the translation with: tongue.switchLanguage('fr');<br>
Put yours translations in translations folder.
Make the link with yours translations on balise width dataset:
<br>
&#60;p <b>data-tongue="word.toast"</b>&#62;&#60;/p&#62;

** If you change something dynamically on your page, with some text, you should update the translation **
<br>
tongue.update();<br>

<h4>Debug mode</h4>
Debug mode show you if there is a missing translation.
By default debug mode is enable. You can change it by two ways:
  - tongue.setDebug( false );
  - Or directly in the class file, in constructor.

<h4>Prevent click</h4>
Prevent click on link/flag if you have a version with server side to
translate your page. It may be useful if some client disable javascript.
You can prevent the click on each href like that:
&#60;a href="/en" <b>data-tongue-flag</b>&#62;href disable&#60;/a&#62;



<h5>TODO:</h5>
Get the translation from the url, navigator language.
