export const toTitleCase = (str) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map((word) => {
        if (['coe', 'jhup', '(son)', '(som)', 'jh', 'jhu', 'cgepi', 'emrs', 'jhbmc', 'jhhcg', 'jhmmc', 'jhpeigo', 'smh', 'ach', 'aicgs', 'jhmi'].includes(word)) {
            return word.toUpperCase()
        }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };

  export const studentCorrection = (text, wordToReplace="Stud", replacement="Students") => {
    const regex = new RegExp('\\b' + wordToReplace + '\\b', 'g');
    return text.replace(regex, replacement);
  }