# Podsearch
<h1 align="center">
    <br>
    <img width="260" src="https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png" alt="Podsearch"/>
	<br>
	<br>
</h1>

<h3 align="center">

[![English README](https://img.shields.io/badge/Language-EN-blue.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/master/README.md)
[![Portuguese README](https://img.shields.io/badge/Linguagem-PT-green.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/readme/README_PT.md)

</h3>

<h4 align="center">

[![bitHound Overall Score](https://www.bithound.io/github/Fazendaaa/podsearch_bot/badges/score.svg?style=flat-square)](https://www.bithound.io/github/Fazendaaa/podsearch_bot)
[![Dependencies](https://david-dm.org/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/blob/master/package.json)
[![Build Status](https://travis-ci.org/Fazendaaa/podsearch_bot.svg?branch=master&style=flat-square)](https://travis-ci.org/Fazendaaa/podsearch_bot)
[![Coverage Status](https://coveralls.io/repos/github/Fazendaaa/podsearch_bot/badge.svg?branch=master&style=flat-square)](https://coveralls.io/github/Fazendaaa/podsearch_bot?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/fazendaaa/podsearch_bot/badge.svg?style=flat-squaretargetFile=package.json)](https://snyk.io/test/github/fazendaaa/podsearch_bot?targetFile=package.json)
[![GitHub issues](https://img.shields.io/github/issues/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/issues)
[![GitHub forks](https://img.shields.io/github/forks/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/network)
[![GitHub stars](https://img.shields.io/github/stars/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/stargazers)
[![GitHub license](https://img.shields.io/github/license/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/blob/master/LICENSE)

</h4>

> A solução que você precisava para poder compartilhar seus podcats favoritos com seus amigos :3

Um bot para [Telegram](https://www.telegram.org/) que realiza pesquisas de podcasts na loja da [iTunes](https://www.apple.com/lae/itunes/).

## Sobre

Esse bot foi feito com [TypeScript](http://typescriptlang.org/)(TS) porque eu queria algum projeto para solidificar minha nova habilidade. E, além disso, poder colocar em prática [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)(TDD), sendo esse o primeiro projeto que utilizo tal forma de programação.

Duas coisas novas em um projeto só? Sim, e a terceira é [Continuos Integration](https://en.wikipedia.org/wiki/Continuous_integration)(CI), que auxília juntar a aplicação que se encontra rodando com código novo. E, uma quarta novidade, é escrever um bot que suporte vários idiomas.

### Medium
Eu escrevi um pouco mais sobre como foi o processo de escrever esse bot no [Medium](https://medium.com/@Fazendaaa/como-construir-um-bot-para-telegram-com-node-ts-testes-ci-e-deploy-para-o-heroku-e763b83fc44e), caso você se interesse sobre e gostaria de fazer um igual.
## Como utilizar?
Primeiro de tudo, abra uma conversa com o [@podsearchbot](https://telegram.me/podsearchbot).
### Aviso
Por padrão os comandos se encontram por em Inglês mas possuem seu equivalente em Português. 
### Pesquisa
Há três maneiras de se fazer isso:
#### Inline
O modo de pesquisa inline funciona na conversa com o Podsearch ou qualquer outra:
```
@podsearchbot nome do podcast
```
Exemplo:
```
@podsearchbot B9
```
<h1 align="center">
    <img src="https://media.giphy.com/media/vgxcHXpZQ7LZwfIteU/giphy.gif" width="650" height="720" />
</h1>

#### Botões
Apenas pressione o botão de pesquisa, ele irá lhe pedir o nome do podcast que deseja pesquisar e realizar a pesquisa.
<h1 align="center">
    <img src="https://media.giphy.com/media/2vrGBus7SfOmHis7EY/giphy.gif" width="650" height="720" />
</h1>

#### ```/pesquise```
Uma vez no chat com o bot, utilize o seguinte comando como em outros bots:
```
/pesquise nome do podcast
```
Exemplo:
```
/pesquise The Mission
```
<h1 align="center">
    <img src="https://media.giphy.com/media/QP79gMlzdwAzlnQPp6/giphy.gif" width="650" height="720" />
</h1>

##### Ajuda
Caso precise de ajuda ou algo do tipo, use o comando:
```
/ajuda
```
# Como funciona?
Você pode construir um bot igual a esse daqui, basta seguir os procedimentos listados em [BUILDING_PT.md](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/building/BUILDING_PT.md).
# Deployment
Esse bot está rodando no [Heroku](http://heroku.com/) através de integração direta do Github, isso significa que cada nova push para a branch ```master``` representa o código que está atualmente servindo de diretriz por bot. Você pode verificar mais como o bot está rodando através do arquivo [Procfile](https://github.com/Fazendaaa/podsearch_bot/blob/master/Procfile). Você também pode enviar uma cópia direta desse código para o Heroku através do seguinte botão:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Fazendaaa/podsearch_bot)

Há também um integração com [Travis CI](http://travis-ci.org/).
# Construído com
* [Wallaby.j](http://wallabyjs.com/) - Plug-in de rodar testes para o [Visual Studio Code](https://code.visualstudio.com/);
* [Jest](https://facebook.github.io/jest/) - Roda os testes;
* [Telegraf.js](http://telegraf.js.org/) - Biblioteca responsável para realizar integração com o Telegram;
* [Telegraf-i18n](https://github.com/telegraf/telegraf-i18n) - Biblioteca responsável para realizar integração com suporte a multiplos idiomas;
* [moment.js](https://momentjs.com/) - Biblioteca que realiza formatação de data;
* [i18n-yaml](https://github.com/martinheidegger/i18n-node-yaml) - Como Telegraf-i18n apenas funciona com Telegraf, há a necessidade de se traduzir outros contextos;
* [dotenv](https://github.com/motdotla/dotenv) - Biblioteca que importa variáveis de ambiente;
* [goo.gl](https://github.com/kaimallea/node-googl) - Biblioteca que reduz os tamanhos dos links;
* * [remove-accents](https://github.com/tyxla/remove-accents) - Essa biblioteca remove os acentos das pesquisas -- como o conteúdo da iTunes store não necessariamente terá acentos, ao remover eles isso facilitará a pesquisa;
* [itunes-search](https://github.com/connor/itunes-node) - Uma das várias bibliotecas que realiza a integração com a loja do iTunes, porém essa é a que melhor o faz.
# Contribuindo
Por favor, eu não sou nativo/fluente em Inglês, então se você ver uma variável escrita errada ou até mesmo um comentário que eu escrevi de maneira errada, me avise. Contribuições não necessariamente devem ser feitas através de código apenas, elas tem a ver com melhorar o que já está presente das mais diversas maneiras para que mais pessoas possam aprender sobre.

Caso seja o código ou não, você pode me ajudar lendo as diretrizes no arquivo [CONTRIBUTING_PT.md](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/contributing/CONTRIBUTING_PT.md). 
# Controle de versão
Eu adoraria dizer que [SemVer](https://semver.org/) ou algo do tipo fora utilizado porém, em experiência pessoal, esse tipo de aborgaem não funciona muito bem comigo, o cara que pode comitar várias vezes esse projeto por duas semanas seguidas e passar um anos sem dar um simples ```npm update``` no projeto. Então, não se é utilizado sistemas de versionamento.
# A realizar
Como esse README estará sendo atualizado com as mudanças importantes, não pretendo utilizar nenhum histórico de atualizações de bugs corrigidos ou novas funcionalidades. Todavia, você pode ter uma noção do que virá:

* Escrever um sistema de notificação para que usuário saiba quando saiu um novo episódio do podcast que ele ouve -- e fazer de tal maneira que leve em consideração a posição no globo que ele se encontra;
* Adicionar recomendações de podcasts baseado no que ouve, ideia do [_lowhigh_](https://www.reddit.com/r/TelegramBots/comments/875tsz/podsearchbot/dwao2qj/) no feedback que me deu no Reddit;
* Integração com o [wit.ia](https://wit.ai/);
* Mudar o encurtardor de URL já que o Goo.gl será desativado.
# Autores
* Apenas [eu](https://github.com/Fazendaaa) até agora.

Considere me comprar um café:

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/Fazenda)

Ou até mesmo se tornar um padrinho:

[![Patreon](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/Fazenda/overview)
# Licença
Assim como muitos projetos de código livre, a licença MIT é utilizada aqui. Mais sobre em [LICENSE](https://github.com/Fazendaaa/podsearch_bot/blob/master/LICENSE).
# Reconhecimentos
* Obrigado a [PurpleBooth](https://gist.github.com/PurpleBooth) por esse [README](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) e esse [CONTRIBUTING](https://gist.github.com/PurpleBooth/b24679402957c63ec426) formato;
* [Mattias Petter Johansson](https://twitter.com/mpjme) e o canal dele [FunFunFunction](https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q), onde eu aprendi várias coisas importantes sobre código e práticas; por favor não pense que são "tutoriais-genéricos" que encontrará lá, ele demonstrará como melhorar o que já possuiu e o que pode aprender em seguida;
* Como a documentação do Jest se demonstrou um pouco confusa para mim, [esse](https://hackernoon.com/api-testing-with-jest-d1ab74005c0a) tutorial me ajudou um pouco, ainda possuo alguns problemas e dificuldades que pretendo corrigir. Acredito que boa parte desses problemas são devidos a lógica pro trás, uma vez que descobrir como corrigí-los irei arrumar isso; por hora tudo está "funcionando" da melhor maneira que consegui abordar;
* Atalmente recomendo ver meu projeto [**ytlofi**](https://github.com/Fazendaaa/ytlofi) caso tenha sofrido com alguns problemas durante a fase de pré-requitos, lá eu explico um pouco melhor sobre outros fatores.
