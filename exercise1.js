const axios = require('axios');

const url = 'http://norvig.com/big.txt';

const init = () => {
    /* Main function where we calling the api to get the data */
    axios.get(url)
        .then(response => {
            const data = response.data;
            const result = readDoc(data);
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });
};

const readDoc = (data) => {
    // regex expression to get only the words
    const words = data.toLowerCase().match(/\b\w+\b/g);

    // using reduce function to get the list of all words with the count
    const wordCount = words.reduce((acc, word) => {
        if (acc[word]) acc[word]++;
        else acc[word] = 1;
        return acc;
    }, {});

    // sorting the words in desending order based on the count
    // taking only the first 10 records after sorted
    // mapping the 10 records to get the final result
    const topWords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));

    return topWords
}

init();

// output
// [
//     { word: 'the', count: 79809 },
//     { word: 'of', count: 40024 },
//     { word: 'and', count: 38312 },
//     { word: 'to', count: 28765 },
//     { word: 'in', count: 22023 },
//     { word: 'a', count: 21124 },
//     { word: 'that', count: 12512 },
//     { word: 'he', count: 12401 },
//     { word: 'was', count: 11410 },
//     { word: 'it', count: 10681 }
// ]

