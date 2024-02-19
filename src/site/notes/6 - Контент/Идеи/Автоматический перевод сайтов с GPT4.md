---
{"dg-publish":true,"permalink":"/6-kontent/idei/avtomaticheskij-perevod-sajtov-s-gpt-4/"}
---

Библиотека или сервис для автоматического перевода (своего) сайта на любой язык с GPT4 (или в будущем OS моделями).

- инсталлируется как типичная i18n библиотека
	- сначала для моего сайта, враппер под eleventy + vercel
- на сайте появляется выбор языка +  автовыбор из браузера
- сайт становится "на любом языке"
- под запрос происходит перевод и кешируется в статику, далее отдается мгновенно
- кеш инвалидируется если обновляется хеш оригинального языка
- альтернатива много проще: на уровне проксирования http, вообще не надо менять код, переводим тупо HTML и весь XHR.

Интересен вопрос о монетизации:
- можно просто сделать OS библиотеку, куда кладешь свой OpenAI ключ и вперед
- но ведь можно сделать и сервис какой-то? Может быть что-то проксирующее? Может быть просто worker в Cloudflare? Может быть там вообще есть механизм платных приложений (вроде нет)?
- хотелось бы one click решение: у вас есть сайт, вы платите денег, и тривиально подключаете его к нашей системе, получая свой сайт во всех языках мира с автодетектом и переключалкой

**Контраргумент:** вся эта функциональность будет заложена в браузеры или даже ОС в целом на уровне просматривающего. 

# Ссылки по теме
- [Eleventy, a simpler static site generator](https://www.11ty.dev/)
	- [GitHub - sgissinger/eleventy-plugin-i18n-gettext](https://github.com/sgissinger/eleventy-plugin-i18n-gettext)
	- [Internationalization with Eleventy 2.0 and Netlify](https://www.lenesaile.com/en/blog/internationalization-with-eleventy-20-and-netlify/)
	- [Plugins — Eleventy](https://www.11ty.dev/docs/plugins/)
	- [GitHub - adamduncan/eleventy-plugin-i18n: Eleventy plugin to assist with internationalization and dictionary translations](https://github.com/adamduncan/eleventy-plugin-i18n)
- [GitHub - tcapelle/gpt\_translate: Translate a docodile website using GPT4](https://github.com/tcapelle/gpt_translate)
- [Site Unreachable](https://www.smartcat.com/news/gpt-4-release/)
- [Matecat with GPT-4: Translate Faster and More Accurately](https://translated.com/matecat-gpt-4)

<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/1759276727962931597?ref_src=twsrc%5Etfw"></a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>