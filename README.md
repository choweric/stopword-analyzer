# Stopword Analyzer Library and Demo

This repository contains:

- **`stopword-analyzer.js`**: A standalone JavaScript class for extracting stopwords/phrases from text and tokenizing non-stopwords, without any external dependencies.
- **Demo**: A web-based demo (`demo.html`) showcasing how to use the `StopwordAnalyzer`&#x20;

### Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/choweric/stopword-analyzer.git
   cd stopword-analyzer
   ```
2. Serve the `demo.html` file via a local HTTP server or open it directly in your browser.

## Usage

### Library API

Include the library in your HTML page:

```html
<script src="stopword-analyzer.js"></script>
```

The library is also available on CDN:

```
<script src="https://pub-7b5fe00ea58845aaac99f41c00eab522.r2.dev/stopword-analyzer.js"></script>
```

Then use it in your JavaScript:

```js
// Initialize with stopwords (newline-delimited)
const analyzer = new StopwordAnalyzer(`a
an
the`);

// Analyze text
const result = analyzer.analyze("The quick brown fox jumps over the lazy dog.");
console.log(result);
// {
//   stopwordsFound: ["the"],
//   nonStopwords: ["quick","brown","fox","jumps","over","lazy","dog"],
//   ratio: 1/7
// }
```

### Demo

Open `demo.html` in your browser. Input text you wish you to process and press “Process” button. You can modify the hard-coded stopword strings in `demo.html`

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

