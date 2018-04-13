# Database
<h3 align="center">

[![English DATABASE](https://img.shields.io/badge/Language-EN-blue.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/database/DATABASE.md)
[![Portuguese DATABASE](https://img.shields.io/badge/Linguagem-PT-green.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/database/DATABASE_PT.md)

</h3>
> Trabalhando nisso ainda

Com o intuito de aprender mais ainda, resolvi desacoplar em dois banco de dados e três entidades no total, dessa maneira, aprender mais sobre outras linguagens e serviços de BD. Sendo que o utilizado para notifcações e usuários será um NoSQL e o utilizado para recomendações será SQL.

_"Por que quebrar em dois BDs?"_ Para pode fazer com que o sistema de recomendação tenha uma idependência de processamento e rodar melhor.

<h1 align="center">
    <br>
    <img src="https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/docs/database/PT/storage.png" alt="armazenamento"/>
	<br>
	<br>
</h1>

# Notifações
O serviço de notificações ainda continuará rodando no programa principal do bot, uma vez que já utilizei serviço parecido com outro projeto, o [ANILISTbot](https://github.com/Fazendaaa/Anilist-bot), e não tive maiores problemas com isso. Será um serviço que verificará o banco de dados de podcast que usários assinam a cada meia hora.

Como o serviço de podcasts em uma parte considerável não possuiu uma frequência de postagens ou até mesmo uma data de próximo episódio; o que particularmente se torna um problema uma vez que poderia ser feito uma fila com o topo sendo o próximo episódio a ser lançado e o topo da lista ser verificado a cada meia hora. Devido a tal contratempo, será necessário que tal lista de podcasts assinados seja percorrida por inteiro a cada meia hora para ver quais lançaram ou não novos episódios.

Pretendo analisar formas de melhorar isso, como um histórico de dias/horários que as podcasts normalmente são lançadas, há podcasts que são lançadas em dias e horários expecíficos, o que facilitaria ao permitir que o sistema infira isso verificando-as apenas naquele perído.

Além disso, o usuário tem que ter a liberdade de configurar a opção de ser notificado sobre um novo episódio quando ele sair ou receber as notificações uma vez por dia sobre todos os que foram liberados. Do ponto de vista de quem consome pouco isso não pode fazer muito sentido, mas se parar para pensar que um usuário pode consumir cinco podcasts semanais e todas elas serem lençadas no mesmo dia, isso pode atrapalhar ele e acabar desativando as notificações do bot. A idiea do bot é ser um lembrete, não algo que fique spamando e atrapalhando o rendimento no dia do usuário.

# Usuários
Entidade bem simples, deverá conter informações básicas sobre o usuário, referências para as podcasts que o usuário ouve e a referência para recomendações...

_"Mas... As recomendações vão ficar em uma entidade diferente do BD?"_ Sim!

O que acontece é o seguinte, como o usuário pode ouvir mais ou menos podcasts, além de assinar ou desassinar ao momento que quiser, ficaria mais fácil não relacionar ele a notificações; já que uma vez que o usuário quiser ver quais podcasts ele ouve seria mais fácil ver através daqui e não percorrer a entidade de notificações indo em uma por uma das podcasts vendo se o usuário está ou não assinando ela e dessa maneira seria mais díficil também excluir um usuário do sistema -- não impossível e pode parecer um custo "aceitável" todavia, ainda assim, não é a melhor abordagem e isso pode ser melhorado e é por isso que o usuário em si estará relacionado as podcasts também.

Já o sistema de recomendações classificará o usuário por grupos, então deixar os usuários altamente acoplados ao sistema de recomendação se mostra não ser uma boa e se as recomendações fossem apenas uma relação entre entidades isso tornaria, para ambas "entidades" -- recomendações será um BD completamente diferente mas pode ser tratado nesse caso como entidade --, algo que não melhoraria com o tempo, seria uma abordagem até força bruta que classificaria o usuário de maneira quase que aleatória, não melhorando o grupo classificação e lapidando o algoritmo por causa disso. E é por isso que esse projeto não seguirá tal caminho.

O importante também é ressaltar as transições, deixar de ouvir um tipo de podcast ou começar a ouvir um estilo pode ser que não influencie muito o algoritmo por ser algo muito expecifico do que ouvir muitas podcasts do mesmo tipo. Isso porque um usuário não necessariamente vai parar de ouvir uma podcast porque "não gosta dela", as vezes a falta de tempo ou a falta de publicações dela podem fazer com que ele prefirar excluir sua assinatura.

# Recomendações
Uma podcast apenas nunca será necessária para classificar um usuário em um grupo apenas. Como o usuário normalmente ouve mais de uma podcast, o conjunto de podcasts será necessário para recomendar o que ele pode ouvir e, além disso, como a poderá pedir os trendings de acordo com a categoria de podcast, isso poderá ajudar bastante.

Uma das preocupações é que os dados não dizem em qual lingaguem a podcast se encontra, então um falante apenas de português pode acabar recebendo uma recomendação de podcast em inglês devido ao tipo de podcast em si, como RPGs por exemplo. Um filtro poderia ser inferir o tipo de podcast através de um algoritmo que retorna qual é a linguagem do feed do RSS e classificar baseado nisso o a linguagem do podcast.

_"E por que rodar em um banco de dados diferentes?"_ Para ter uma melhor performace.

Além do aprendizado, separar o motor de recomendações do bot em si é questão de performace. Como o bot cuida de requests de pesquisas -- tarefa responsiva -- e notificação -- uma tarefa agendada --, ele não fica sobrecarregado ao decorrer do tempo; se as recomendações rodassem acoplado deles a dificuldade de escalar e dar manutenabilidade seria maior do que separar. Essa é uma das vezes que o monolito não se mostra vantajoso e quebrar o sistema em micro serviços é mais.

Continuando com a ideia de aprender coisas novas, desde que o Google apresentou o [Tensor Flow](https://www.tensorflow.org/) fiquei com vontade de utilizar, ainda mais depois que fizeram as bindings para JavaScript. Porém, utilizar os serviços de hosting do Google e Go para fazer isso parece ser um oportunidade boa para aprender a utilzar eles.

Então quando o usuário quiser uma recomendação o bot fará uma requisição através de uma API para o motor de busca para retornar recomendações.

# Indo além
A estruturação das notificações e usuários se encontrará disponível em [NOSQL_PT.md](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/database/NOSQL_PT.md) enquanto a de recomendações estará disponível em [SQL_PT.md](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/database/SQL_PT.md).
