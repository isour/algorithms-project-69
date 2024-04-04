export default (docs, searchStr) => {
  const getTF = (wordsCount, docWordsCount) => (wordsCount || 1) / docWordsCount;

  const getIDF = (count, wordCount) => Math.log(Math.abs(count) / Math.abs(wordCount));

  const wordsInCollection = {};

  const index = docs.reduce((acc, { id: documentId, text: documentText }) => {
    const documentWords = documentText.toLowerCase().match(/\w+/g);
    const documentWordsCount = documentWords.length;
    const currentWordData = {};

    documentWords.forEach((word) => {
      wordsInCollection[word] = wordsInCollection[word]
        ? wordsInCollection[word] + 1
        : 1;
      const currentWordCount = currentWordData[word]?.count;
      const currentTf = getTF(currentWordCount, documentWordsCount);

      currentWordData[word] = {
        id: documentId,
        count: currentWordCount ? currentWordCount + 1 : 1,
        tf: currentTf,
      };
    });

    return { ...acc, [documentId]: currentWordData };
  }, {});

  const searchDocs = (searchStr2, reverseIndex) => {
    if (!searchStr2) return [];
    const searchWords = searchStr2.toLowerCase().match(/\w+/g);
    const wordsCount = Object.values(reverseIndex).length;

    const result = {};


    Object.entries(index).forEach(([, documentInfo]) => {
      // console.log(documentInfo, 'documentInfo');
      Object.entries(documentInfo).forEach(([word, wordInfo]) => {
        // console.log(word, wordInfo, 'word');
        if (!result[word]) {
          result[word] = [];
        }

        result[word].push({
          id: wordInfo.id,
          tfIdf: wordInfo.tf * getIDF(wordsCount, wordsInCollection[word]),
        });
      });
    });

    Object.entries(result).forEach(([word, docInfo]) => {
      result[word] = docInfo.sort((a, b) => a.tfIdf - b.tfIdf);
    });

    Object.keys(result).forEach((key) => {
      const currentWord = result[key];

      result[key] = currentWord.map((wl) => wl.id);
    });

    if (!result[searchWords[0]]) return [];

    console.log(result, searchWords, 'searchWords');

    return [
      ...new Set(
        searchWords.reduce((acc, word) => {
          let newAcc = [...acc];
          if (result[word]) {
            newAcc = [
              ...newAcc,
              ...result[word],
            ];
          }
          return newAcc;
        }, []),
      ),
    ];
  };

  return searchDocs(searchStr, index);
};
