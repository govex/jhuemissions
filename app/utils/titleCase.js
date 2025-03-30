export const toTitleCase = (str) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map((word) => {
        if (['jh', 'jhu', 'cgepi', 'emrs', 'jhbmc', 'jhhcg', 'jhmmc', 'jhpeigo', 'smh', 'ach', 'aicgs', 'jhmi'].includes(word)) {
            return word.toUpperCase()
        }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };