# Tongue
Manage yours translations dynamically on your website. No reload page !

<h2><a href="http://buuuuug.ddns.net/tongue/">=> DEMO <=</a></h2>

You can use the TypeScript version or the prototype js.

Example on the index.html
Summary
Instantiate the class: tongue = new Tongue('en');
You can easily change the translation with: tongue.switchLanguage('fr');

** If you change something dynamically on your page, with some text, you should update the translation **
tongue.update();

By default debug mode is enable. You can change it by two ways:
  - tongue.setDebug( false );
  - Or directly in the class file, in constructor.
