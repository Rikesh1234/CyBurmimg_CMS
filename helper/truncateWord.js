function truncateWords(text, numWords) {
    const words = text.split(' ');
    return words.slice(0, numWords).join(' ') + (words.length > numWords ? '...' : '');
}

module.exports = {
    truncateWords, // Make sure this is "truncateWords"
};
