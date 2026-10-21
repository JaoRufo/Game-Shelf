# GameShelf

## Descrição

O GameShelf é um aplicativo mobile para explorar jogos gratuitos e organizar um inventário pessoal. O usuário pode pesquisar jogos, consultar detalhes, definir status, adicionar observações e manter seus jogos salvos localmente.

## Aluno

- Nome: João Victor Rufo Pereira
- RGM: 41842341
- Unifran - Análise e Desenvolvimento de Sistemas - Euller Da Silva Ferreira

## Telas

- **Home/Explorar:** carrega o catálogo, permite pesquisar por nome, filtrar por gênero e navegar entre páginas.
- **Detalhes do jogo:** exibe informações completas, permite adicionar o jogo ao inventário e escolher status e observações.
- **Inventário:** lista os jogos salvos, mostra o status nos cards, filtra por status e permite editar observações ou remover jogos pelo menu de três pontos.
- **Splash screen:** apresenta o logo do GameShelf com animação de entrada e carregamento inicial.

## Fonte de dados

O catálogo principal vem da API pública FreeToGame:

- Documentação: https://www.freetogame.com/api-doc
- Lista de jogos: https://www.freetogame.com/api/games
- Detalhes de jogo: https://www.freetogame.com/api/game?id=ID

Quando a API não está disponível, o app utiliza o catálogo local em `src/data/games.json`.

## Onde estão os requisitos

- **Componentes:** `src/components/`, incluindo `GameCard.js`, `PrimaryButton.js`, `SearchBar.js`, `BottomNavigation.js`, `AnimatedBrandTitle.js` e `StartupSplash.js`.
- **Props com callback:** `App.js` envia callbacks como `onAdd`, `onStatusChange`, `onNotesChange` e `onRemove` para as telas; `MainScreen.js` controla a troca entre Home e Inventário.
- **useState:** usado em `App.js`, `ExploreScreen.js`, `LibraryScreen.js`, `GameDetailsScreen.js` e `MainScreen.js` para biblioteca, catálogo, filtros, modal, status, observações e navegação.
- **useEffect:** usado para carregar e salvar a biblioteca no AsyncStorage, buscar jogos na API, executar animações e reagir ao ciclo de vida do app.
- **Navegação com parâmetros:** `ExploreScreen.js` e `LibraryScreen.js` abrem `GameDetails` com `navigation.navigate("GameDetails", { game, fromLibrary })`.
- **Persistência local:** `App.js` utiliza `@react-native-async-storage/async-storage` com a chave `@gameshelf/library`.
- **Regras da biblioteca:** `src/utils/libraryHelpers.js` contém as funções de adicionar, alterar status, atualizar observações e remover jogos.

## Vídeo de demonstração

demo/demo.mp4

Link do Drive: https://drive.google.com/file/d/1E4iKqjJwdaHwMopXqP26wLObPrjYA2z1/view?usp=drive_link

## Como executar

```bash
npm install
npx expo start
```

Depois, leia o QR code pelo Expo Go ou utilize um emulador Android/iOS configurado.

## Tecnologias

- React Native
- Expo SDK 57
- JavaScript
- React Navigation Native Stack
- AsyncStorage
- API Fetch
