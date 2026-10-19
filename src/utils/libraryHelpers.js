export const STATUS_OPTIONS = ['Quero jogar', 'Jogando', 'Zerado'];

export const addToLibrary = (library, game) => {
  if (library.find((item) => String(item.id) === String(game.id))) return library;
  return [...library, { ...game, status: 'Quero jogar' }];
};

export const updateLibraryStatus = (library, id, status) =>
  library.map((item) => (String(item.id) === String(id) ? { ...item, status } : item));

export const removeFromLibrary = (library, id) =>
  library.filter((item) => String(item.id) !== String(id));
