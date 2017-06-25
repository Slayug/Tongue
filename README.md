# Tongue
Manage yours translations dynamically on your website. No reload page !

## [⇒ Demo](http://buuuuug.ddns.net/tongue/)

You can use the TypeScript version or the prototype js.

## Summary
### How-To
Put yours translations in translations folder, in json file (en.json):
```json
{
    "language":"en",
    "translation":{
        "word.toast": "toast",
        "word.translation": "Translation:",
        "paragraph.eurovelo": "I wanna be the very best\nLike no one ever was\nTo catch them is my real test\nTo train them is my cause\nI will travel across the land\nSearching far and wide\nEach Pokemon to understand\nThe power that's inside"
    }
}
```
In your javascript part, instantiate the class:
`tongue = new Tongue('en');`

You can easily change the translation with:
`tongue.switchLanguage('en');`

Then in your json balise, set the link with yours translations with dataset:
```html
<p data-tongue="word.toast"></p>
```

** **If you change something dynamically on your page, with some text, you should update the translation** **
`tongue.update();`

###Debug mode
Debug mode show you if there is a missing translation.
By default debug mode is enable. You can change it by two ways:

 - `tongue.setDebug( false );`
 - Or directly in the class file, in constructor.

### Prevent click
Prevent click on link/flag if you have a version with server side to
translate your page. It may be useful if some client disable javascript.
You can prevent the click on each href like that:
```html
<a href="/en" data-tongue-flag>href disable</a>
```

### TODO
Get the translation from the url, navigator language.
