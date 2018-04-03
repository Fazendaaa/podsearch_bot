# Construindo um

<h3 align="center">

[![English BUILDING](https://img.shields.io/badge/Language-EN-blue.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/docs/building/BUILDING.md)
[![Portuguese BUILDING](https://img.shields.io/badge/Linguagem-PT-green.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/building/BUILDING_PT.md)

</h3>

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
