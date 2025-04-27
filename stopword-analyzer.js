
/**
 * StopwordAnalyzer performs stopword extraction and non-stopword tokenization
 * using a single, precomputed regex to efficiently process text input. 
 * It reports unique stopwords found, unique non-stopword tokens, and their ratio.
 *
 * @class StopwordAnalyzer
 * @classdesc Instantiate with a newline-delimited list of stopwords or phrases;
 *            call `analyze(text)` to retrieve:
 *            - `stops`: unique stopwords/phrases detected  
 *            - `nonStops`: unique remaining words  
 *            - `ratio`: stopword-to-non-stopword count  
 *
 * @param {string} list  - Newline-separated stopwords or stop-phrases to match against input text 
 *
 * @example                              
 * const analyzer = new StopwordAnalyzer("a\nan\nthe");
 * const result   = analyzer.analyze("The quick brown fox jumps over the lazy dog.");
 * console.log(result);
 * // {
 * //   stopwordsFound: ["the"],
 * //   nonStopwords: ["quick","brown","fox","jumps","over","lazy","dog"],
 * //   ratio: 0.14285714285
 * // }
 *
 * @author Eric Chow 
 * @version 1.0.0   
 */
class StopwordAnalyzer {

  constructor(list) {
    this.stopPhrases = list
      .split(/\r?\n/)                       // 1) Split raw input into lines on LF or CRLF, preserving empty lines only if needed
      .map(s => s.trim().toLowerCase())     // 2) Trim whitespace & lowercase each entry for consistent, case-insensitive matching
      .filter(Boolean)                      // 3) Remove any blank entries from accidental extra newlines     
      .sort((a,b) => b.length - a.length);  // 4) Sort descending by phrase length so "for the most part" matches before "for" or "the"

    // 5) Escape all regex metacharacters in each phrase so they match literally
    const esc = this.stopPhrases.map(p =>
      p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    // 6) Build a single global, case-insensitive regex:
    //   \b...\b ensures whole-word/phrase matching; alternation lets us test all in one go
    //   'g' for global scan, 'i' for ignore-case
    this.stopRegex = new RegExp('\\b(' + esc.join('|') + ')\\b', 'gi');
  }

  /**
   * Analyze the provided text:
   *  - Extract unique stopwords/phrases
   *  - Strip them out, then tokenize remaining text into unique words
   *  - Compute ratio of stopwords to non-stopwords
   */
  analyze(text) {
    const txt = text.toLowerCase();                             // 1) Normalize to lowercase once for efficient subsequent matching
    let m, matches=[];
    while((m=this.stopRegex.exec(txt))!==null) {                // 2) Use exec() in a loop to capture all stopword matches (thanks to the 'g' flag)
      matches.push(m[1]); // capture group holds the matched phrase
    }
    const stops = Array.from(new Set(matches));                 // 3) Dedupe the list of found stopwords for reporting
    const cleaned = txt.replace(this.stopRegex, ' ');           // 4) Remove all stopwords by replacing with spaces, preventing token merge
    const tokens = cleaned.split(/[^a-z0-9]+/).filter(Boolean); // 5) Split on non-alphanumeric sequences to get candidate words, and filter(Boolean) drops any empty strings from consecutive delimiters
    const nonStops = Array.from(new Set(tokens));               // 6) Dedupe the non-stopword tokens
    const ratio = nonStops.length === 0                         // 7) Compute ratio; guard against division-by-zero if no non-stopwords found
      ? null
      : (stops.length / nonStops.length);
    return { nonStops, stops, ratio };                            // 8) Return a simple object containing everything downstream code needs
  }

}

