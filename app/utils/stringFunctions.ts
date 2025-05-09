export function toTitleCase(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ').map((word) => {
        if (['(sais)', 'coe', 'jhup', '(son)', '(som)', 'jh', 'jhu', 'cgepi', 'emrs', 'jhbmc', 'jhhcg', 'jhmmc', 'jhpiego', 'smh', 'ach', 'aicgs', 'jhmi'].includes(word)) {
            return word.toUpperCase()
        }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
};

export function formatPlaces(place) {
  let splits = place.split(', ')
  if (splits[1].length > 2) {
    return `${splits[0]}, ${toTitleCase(splits[1])}`
  } else {
    return splits.slice(0,2).join(", ")
  }
}

