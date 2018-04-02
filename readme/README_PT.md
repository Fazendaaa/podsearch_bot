# Podsearch
<h1 align="center">
    <br>
    <img width="260" src="https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png" alt="Podsearch"/>
	<br>
	<br>
</h1>

<h3 align="center">

[![English README](https://github.com/Fazendaaa/podsearch_bot/blob/master/README.md)](https://img.shields.io/badge/Language-EN-blue.svg?longCache=true&style=for-the-badge)
[![Portuguese README](https://github.com/Fazendaaa/podsearch_bot/blob/master/readme/README_PT.md)](https://img.shields.io/badge/Language-PT-green.svg?longCache=true&style=for-the-badge)

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
### Pesquisa
Há duas maneiras de se fazer isso:
#### ```/search```
Uma vez no chat com o bot, utilize o seguinte comando como em outros bots:
```
/search podcast name
```
Exemplo:
```
/search The Story by The Mission
```
<h1 align="center">
    <img src="https://media.giphy.com/media/6C6NusTKMkC8UCsM0d/giphy.gif" width="500" height="550" />
</h1>

#### Inline
O modo de pesquisa inline funciona na conversa com o Podsearch ou qualquer outra:
```
@podsearchbot podcast name
```
Exemplo:
```
@podsearchbot The Story by The Mission
```
<h1 align="center">
    <img src="https://media.giphy.com/media/3CVtxjnZ9HKGhjeeiD/giphy.gif" width="500" height="550" />
</h1>

##### Ajuda
Caso precise de ajuda ou algo do tipo, use o comando:
```
/help
```
# Como funciona?
Você pode construir um bot igual a esse daqui, basta seguir os procedimentos que se seguem.
## Pré-requisitos
Como esse bot fora construído utilizando Linux, os passos serão demonstrados tendo-se em mente a plataforma em questão. Usuários de Mac e Windows deverão pesquisar como realizar procedimentos equivalentes nos respectivos sistemas.
### Antes de tudo...
Você precisará gerar uma [API key](https://en.wikipedia.org/wiki/Application_programming_interface_key) do Telegram e isso é fácil, apenas siga o seguinte [procedimento](https://core.telegram.org/bots#3-how-do-i-create-a-bot). Como os links de RSS e da iTunes são encurtados também será necessário uma API key do Google URL Shortener, mais sobre isso [aqui](https://developers.google.com/url-shortener/v1/getting_started).
### Configurando o sistema...
Instale o [npm](https://www.npmjs.com/) e o [Node.js](https://nodejs.org/en/) na sua máquina. Voltando a questão do Linux, como há várias ferramentas de gerenciamento de pacotes, dependendo de qual distribuição se encontra, cada uma com sua particularidade, você deverá pesquisar como fazer isso. Mas uma vez finalizado tal processo, abra um terminal, navegue até o diretório onde você quer que o projeto fique e rode o seguinte comando:
```bash
git clone https://github.com/Fazendaaa/podsearch_bot
```
Você deverá ver algo similar ao seguinte:
```bash
Cloning into 'podsearch_bot'...
remote: Counting objects: 98, done.
remote: Compressing objects: 100% (56/56), done.
remote: Total 98 (delta 36), reused 88 (delta 32), pack-reused 0
Unpacking objects: 100% (98/98), done.
```
## Instalando as dependências
Rode o seguinte comando no diretório raíz do projeto:
```bash
npm install
```
Após alguns instantes um diretório chamado "node_modules" deverá aparecer. Se algum problema ocorrer a partir de agora, provavelmente estará relacionada com atulizações das dependências entre a época dessa escrita até a versão mais recente.

Uma vez finalizada as instalações:
```bash
npm run build
```
Você deverá verificar que não há nenhuma mensagem de aviso ou erro no terminal, não se preocupe, nenhuma informação deverá ser esperada nesse processo.

Agora é um ótimo momento para salvar as API keys geradas anteriormente na parte dos [Pré-requisitos](https://github.com/Fazendaaa/podsearch_bot#Pré-requisitos); caso não tenha feito isso ainda o bot não irá funcionar. Para criar o arquivo que ficará salvo as keys, no seu diretório raíz digite:
```bash
touch .env
```
Uma vez criado o arquivo, o abra e cole as keys, elas serão as variáveis de ambiente. Apenas se lembre que essas keys estão linkadas à você e não deverão ser compartilhadas com mais ninguém, se lembre também de sempre colocar tal arquivo no seu [.gitignore](https://github.com/Fazendaaa/podsearch_bot/blob/master/.gitignore), dessa maneira essas keys não serão compartilhadas com o Github. O seu arquivo .env deverá ser parecido com o seguinte:
```bash
BOT_KEY="YourTelegramBotAPIKey"
GOOGLE_KEY="YourGoogleURLShortenerAPIKey"
```
# Executando
Após todo esse procedimento, rode o bot com o seguinte comando:
```bash
npm run start
```
Todas as requisições que o bot receber serão mostradas no terminal. Divirta-se :3
# Realizando os testes
Como mencionado anteriormente, esse é meu primeiro contato com TDD e todo o código é testado como código em TS graças ao [jest-ts](https://github.com/kulshekhar/ts-jest), não há necessidade de compilar ele para JavaScript para só então rodar os testes.
## Olhando mais profundamente
Como, durante essa escrita, há apenas um arquivo no qual os testes serão realizados. Você poderá ver mais sobre tal na pasta de [testes](https://github.com/Fazendaaa/podsearch_bot/tree/master/test). Para executá-los, basta apenas realizar o seguinte comando no diretório raíz:
```bash
npm test
```
E o resultado deverá ser apresentado, algo similar com:
```bash
 PASS  __test__/utils.test.ts
  Testing removeCmd function
    ✓ Searching "/search Nerdcast". (4ms)
    ...
    ✓ Has no number of episodes.

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |     67.5 |       52 |    60.71 |     67.5 |                   |
 utils.ts |     67.5 |       52 |    60.71 |     67.5 |... 98,299,302,307 |
----------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       71 passed, 71 total
Snapshots:   0 total
Time:        1.773s
Ran all test suites.
```
Mais sobre as configurações dos testes podem ser verificadas em [jest.config.js](https://github.com/Fazendaaa/podsearch_bot/blob/master/jest.config.js).
## Estilo de código
Como TS pode ser lintado com [ESlint](https://eslint.org/) ou [TSLint](https://palantir.github.io/tslint/), eu escolhi a segunda opção por ser a ferramenta expecífica de TS apenas, permanecer no ecosistema; todavia, ESlint funcionará bem também. Para saber mais das configurações atuais, verifique [tslint.config](https://github.com/Fazendaaa/podsearch_bot/blob/master/tslint.json).

Caso você possua experiência programando em JS e gostaria de saber que mágica é essa de "compilar" -- eu uso esse termo salva-guardando algumas dores minhas, ainda acredito que a palavra certa para tal seria _transpilando_, mas como a oficial é compilar, ela que será utilizada -- TS para JS é realizada, quais diretrizes tal processo segue, veja [tsconfig.json](https://github.com/Fazendaaa/podsearch_bot/blob/master/tsconfig.json).
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
* [itunes-search](https://github.com/connor/itunes-node) - Uma das várias bibliotecas que realiza a integração com a loja do iTunes, porém essa é a que melhor o faz.
# Contribuindo
Por favor, eu não sou nativo/fluente em Inglês, então se você ver uma variável escrita errada ou até mesmo um comentário que eu escrevi de maneira errada, me avise. Contribuições não necessariamente devem ser feitas através de código apenas, elas tem a ver com melhorar o que já está presente das mais diversas maneiras para que mais pessoas possam aprender sobre.

Caso seja o código ou não, você pode me ajudar lendo as diretrizes no arquivo [CONTRIBUTING_PT.md](https://github.com/Fazendaaa/podsearch_bot/blob/master/contributing/CONTRIBUTING_PT.md). 
# Controle de versão
Eu adoraria dizer que [SemVer](https://semver.org/) ou algo do tipo fora utilizado porém, em experiência pessoal, esse tipo de aborgaem não funciona muito bem comigo, o cara que pode comitar várias vezes esse projeto por duas semanas seguidas e passar um anos sem dar um simples ```npm update``` no projeto. Então, não se é utilizado sistemas de versionamento.
# A realizar
Como esse README estará sendo atualizado com as mudanças importantes, não pretendo utilizar nenhum histórico de atualizações de bugs corrigidos ou novas funcionalidades. Todavia, você pode ter uma noção do que virá:

* Escrever CONTRIBUTING_PT de tal maneira a deixar claro que qualquer ajuda seja bem vinda, pricipalmente se for para traduzir o bot para outros idiomas;
* Escrever um sistema de notificação para que usuário saiba quando saiu um novo episódio do podcast que ele ouve -- e fazer de tal maneira que leve em consideração a posição no globo que ele se encontra;
* Adicionar recomendações de podcasts baseado no que ouve, ideia do [_lowhigh_](https://www.reddit.com/r/TelegramBots/comments/875tsz/podsearchbot/dwao2qj/) no feedback que me deu no Reddit;
* Integração com o [wit.ia](https://wit.ai/).
# Autores
* Apenas [eu](https://github.com/Fazendaaa) até agora.
# Licença
Assim como muitos projetos de código livre, a licença MIT é utilizada aqui. Mais sobre em [LICENSE](https://github.com/Fazendaaa/podsearch_bot/blob/master/LICENSE).
# Reconhecimentos
* Obrigado a [PurpleBooth](https://gist.github.com/PurpleBooth) por esse [README](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) e esse [CONTRIBUTING](https://gist.github.com/PurpleBooth/b24679402957c63ec426) formato;
* [Mattias Petter Johansson](https://twitter.com/mpjme) e o canal dele [FunFunFunction](https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q), onde eu aprendi várias coisas importantes sobre código e práticas; por favor não pense que são "tutoriais-genéricos" que encontrará lá, ele demonstrará como melhorar o que já possuiu e o que pode aprender em seguida;
* Como a documentação do Jest se demonstrou um pouco confusa para mim, [esse](https://hackernoon.com/api-testing-with-jest-d1ab74005c0a) tutorial me ajudou um pouco, ainda possuo alguns problemas e dificuldades que pretendo corrigir. Acredito que boa parte desses problemas são devidos a lógica pro trás, uma vez que descobrir como corrigí-los irei arrumar isso; por hora tudo está "funcionando" da melhor maneira que consegui abordar;
* Atalmente recomendo ver meu projeto [**ytlofi**](https://github.com/Fazendaaa/ytlofi) caso tenha sofrido com alguns problemas durante a fase de pré-requitos, lá eu explico um pouco melhor sobre outros fatores.
