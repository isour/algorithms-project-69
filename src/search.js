const getTF = (wordsCount, docWordsCount) => (wordsCount || 1) / docWordsCount;

const getIDF = (count, wordCount) => Math.log(Math.abs(count) / Math.abs(wordCount));

const wordsInCollection = {};

const normalizeString = (str) => str.toLowerCase().match(/\w+/g);

const buildWordInfo = (documents) => documents.reduce((acc, document) => {
  const { id: documentId, text: documentText } = document;
  const documentWords = normalizeString(documentText);
  const currentWordData = {};

  documentWords.forEach((word) => {
    wordsInCollection[word] = wordsInCollection[word]
      ? wordsInCollection[word] + 1
      : 1;
    const currentWordCount = currentWordData[word]?.count;
    const currentTf = getTF(currentWordCount, documentWords.length);

    currentWordData[word] = {
      id: documentId,
      count: currentWordCount ? currentWordCount + 1 : 1,
      tf: currentTf,
    };
  });

  return { ...acc, [documentId]: currentWordData };
}, {});

const calculateTfIdf = (wordsInfo, wordsCount) => {
  const result = {};

  Object.entries(wordsInfo).forEach(([, documentInfo]) => {
    Object.entries(documentInfo).forEach(([word, wordInfo]) => {
      if (!result[word]) {
        result[word] = [];
      }

      result[word].push({
        id: wordInfo.id,
        tfIdf: wordInfo.tf * getIDF(wordsCount, wordsInCollection[word]),
      });
    });
  });

  return result;
};

const searchDocs = (searchStr2, wordsInfo) => {
  if (!searchStr2) return [];
  const searchWords = normalizeString(searchStr2);
  const wordsCount = Object.values(wordsInfo).length;

  const result = calculateTfIdf(wordsInfo, wordsCount);

  Object.entries(result).forEach(([word, docInfo]) => {
    result[word] = docInfo.sort((a, b) => a.tfIdf - b.tfIdf);
  });

  Object.keys(result).forEach((key) => {
    const currentWord = result[key];

    result[key] = currentWord.map((wl) => wl.id);
  });

  if (!result[searchWords[0]]) return [];

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

export default (docs, searchStr) => searchDocs(searchStr, buildWordInfo(docs));
