# GameShelf

Nome do aluno: `João Victor Rufo Pereira`  
Disciplina: `Programação para dispositivos móveis - Euller Da Silva Ferreira`
Instituição e Curso: `Unifran - Universidade de Franca - Análise e Desenvolvimento de Sistemas`

## Descrição

GameShelf é uma biblioteca pessoal de jogos gratuitos. O aplicativo consulta o catálogo público FreeToGame, permite pesquisar e filtrar jogos, abre detalhes e mantém uma coleção pessoal com status `Quero jogar`, `Jogando` ou `Zerado`.

## Funcionalidades

- Catálogo remoto via `fetch`, com busca, filtro por gênero e paginação de 10 itens.
- Fallback versionado em `src/data/games.json` quando a API, a rede ou a resposta falham.
- Tela de detalhes com consulta complementar e tratamento de campos ausentes.
- Adição sem duplicatas, alteração de status e remoção da biblioteca.
- Persistência local com AsyncStorage.
- Estados de carregamento, erro, lista vazia e imagem indisponível.

## Tecnologias

React Native, Expo SDK 58, JavaScript, React Navigation Native Stack, `fetch`, `FlatList` e `@react-native-async-storage/async-storage`.

## Estrutura

```text
App.js
src/components/       GameCard, PrimaryButton e SearchBar
src/screens/          ExploreScreen, GameDetailsScreen e LibraryScreen
src/services/         freeToGameApi.js
src/data/             games.json
src/styles/            theme.js
src/utils/             libraryHelpers.js
```

## Pré-requisitos e instalação

Node.js LTS, npm e Expo Go compatível com SDK 58. Na pasta do projeto:

```bash
npm install
npm start
```

Depois, leia o QR code no Expo Go ou pressione `a` para um emulador Android configurado. Também estão disponíveis `npm run android` e `npm run ios`. O alvo principal é React Native; não foi adicionada dependência web ao projeto.

## API e fallback

A fonte principal é a [documentação da FreeToGame](https://www.freetogame.com/api-doc), usando `/api/games` e `/api/game?id=...`. Todas as chamadas ficam em `src/services/freeToGameApi.js`, verificam `response.ok`, validam o JSON, têm timeout e aceitam cancelamento por `AbortController`.

Quando o catálogo remoto falha, o ExploreScreen carrega `games.json` e exibe um aviso de modo offline com ação de nova tentativa. Para testar: desligue a conexão ou bloqueie temporariamente a URL, abra o Explore e confirme o aviso e a lista local. Os registros locais são uma cópia representativa de jogos conhecidos do catálogo; a origem dos dados deve ser atribuída à FreeToGame.

## Telas e navegação

- **Explorar:** catálogo, busca, filtro, paginação de 10 itens, carregamento, erro e fallback. O `GameCard` navega com `navigation.navigate('GameDetails', { game })`.
- **Detalhes:** recebe `route.params.game`, tenta obter detalhes atualizados uma vez por abertura e permite salvar, alterar status ou remover.
- **Minha biblioteca:** lista persistida e independente da API, com status, remoção e retorno aos detalhes.

O `App.js` registra exatamente as três telas em `createNativeStackNavigator` e mantém a biblioteca compartilhada por props e callbacks.

## Componentes e estado

`GameCard` é reutilizado no catálogo e na biblioteca; `PrimaryButton` concentra botões de ação; `SearchBar` é um campo controlado por `value` e `onChangeText`. `useState` controla catálogo/carregamento/busca/filtro, detalhes e biblioteca. O `useEffect` do Explore carrega o catálogo ao montar ou ao tentar novamente, e seu cleanup cancela a requisição e impede atualização após desmontagem. Outro efeito carrega e salva a biblioteca no AsyncStorage somente após a leitura inicial.

As operações em `libraryHelpers.js` usam `find`, `map`, `filter` e spread, sem mutar o array original.

## Requisitos e arquivos

| Requisito                   | Implementação                                                              |
| --------------------------- | -------------------------------------------------------------------------- |
| API centralizada e fallback | `src/services/freeToGameApi.js`, `ExploreScreen.js`, `src/data/games.json` |
| Três telas e stack          | `App.js` e `src/screens/`                                                  |
| Componentes reutilizáveis   | `src/components/`                                                          |
| Busca e filtro              | `ExploreScreen.js`                                                         |
| Biblioteca e status         | `LibraryScreen.js`, `GameDetailsScreen.js`, `libraryHelpers.js`            |
| Persistência                | `App.js` com AsyncStorage                                                  |
| Estilo escuro               | `src/styles/theme.js`, styles locais e `app.json`                          |
| Estados e cleanup           | `ExploreScreen.js`, `GameDetailsScreen.js`                                 |

## Limitações e entrega

A disponibilidade da API depende da rede e do serviço público. As capas são URLs remotas e possuem placeholder quando falham. Não há autenticação, backend ou cache complexo.

## Créditos

Dados e imagens de catálogo são obtidos da FreeToGame. Consulte os termos e a documentação da fonte antes da publicação acadêmica.
