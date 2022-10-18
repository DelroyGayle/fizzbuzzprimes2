import { useState } from "react";
import { Dna } from "react-loader-spinner";

import "./App.css";

const wordEndings = ["ff", "ll", "ss", "tt", "zz"];
const wordEndingsSize = wordEndings.length;

const wordColours = [
  "pink-colour",
  "aqua-colour",
  "palered-colour",
  "deeporange-colour",
  "bluegrey-colour",
  // "purple-colour", PURPLE REMOVED
];
const wordColoursSize = wordColours.length;

const wordUsage = new Set(["fizz", "buzz", "fizzbuzz"]);

const capitalise = (word) => word[0].toUpperCase() + word.substring(1);

const sieveEratosthenes = (numsArr, limit = 201) => {
  for (let i = 2; i <= Math.sqrt(limit); i++) {
    // Check if numsArr[i] === true
    if (numsArr[i]) {
      /* 
          convert all elements in the numsArr 
          whose indexes are multiples of i 
          to undefined
      */

      for (let j = i + i; j <= limit; j += i) {
        numsArr[j] = undefined;
      }
    }
  }

  return numsArr
    .slice(3) // ignore 0 1 2
    .filter((element) => element); // remove unfiltered
};

/* Split button text number:text INTO <span>number</span><span>text</span> 
   in order to display as two lines */
function Output({ result }) {
  return (
    <div className="flexbox-container">
      {result.map((element, index) => {
        const { text: buttonText, colour: buttonColour } = element;
        let splits = buttonText.split(":");
        return (
          <div key={index} className={`button-6 flexbox-item ${buttonColour}`}>
            <div>
              <span>{splits[0]}</span>
              <span>{splits[1]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [listReady, setListReady] = useState(null);
  const [err, setErr] = useState("");

  let resultsList = [];
  let primeNumbers = [];
  let primesWithWords = [];

  const fetchWord = async (aPrimeNumber) => {
    // Randomly pick a word ending
    let randomNum = (Math.random() * wordEndingsSize) << 0;

    try {
      // Fetch a 5 letter word with this word ending

      const response = await fetch(
        `https://api.datamuse.com/words?sp=???${wordEndings[randomNum]}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error! status: ${response.status} whilst processing number ${aPrimeNumber}` +
            ` word ending ${wordEndings[randomNum]}`
        );
      }

      let result = await response.json();
      /*
             1) Only use if the score is above 200
             Although Datamuse's documentation states that
             the "score" field has no interpretable meaning, other than as a way to rank the results.
             From what I can see, anything below 200 is either a slang word or a very obscure word
             So choose above 200
             EG
                 {
                  "word": "dwell",
                  "score": 3780
                 },
                 {word: 'grass', score: 4805}

            2) Don't allow words with spaces in between i.e. go off, at all
            {number: 107, text: 'go off', colour: 'palered-colour'}
            {number: 109, text: 'at all', colour: 'purple-colour'}

            3) ensure the word has NOT already been selected for a previous prime number

            Use a set
      */

      let verify = result.find(
        (element) =>
          element.score > 200 &&
          /^[\S]+$/.test(element.word) &&
          !wordUsage.has(element.word)
      );

      // Ensure that the word has not been used before
      if (verify === undefined) {
        /*
              If the word has been used before and there are no other suitable candidates in 'result'
              then find an alternative using the other possible wordEndings
        */
        let usedEnding = wordEndings[randomNum];
        let foundFlag = false;
        for (const anEnding of wordEndings) {
          if (anEnding === usedEnding) {
            // ignore this one - used already
            continue;
          }

          // fetch alternative word from remote API
          const response = await fetch(
            `https://api.datamuse.com/words?sp=???${anEnding}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              `Error! status: ${response.status} whilst processing number ${aPrimeNumber}` +
                ` word ending ${anEnding}`
            );
          }

          result = await response.json();
          // 1) Ensure score > 200
          // 2) Ensure no spaces in the 'word' e.g. "go off", "at all"
          // 3) Ensure suitably scored word has NOT been selected already
          // for a previous prime number
          verify = result.find(
            (element) =>
              element.score > 200 &&
              /^[\S]+$/.test(element.word) &&
              !wordUsage.has(element.word)
          );
          if (verify !== undefined) {
            foundFlag = true;
            break;
          }
        }

        if (!foundFlag) {
          // I cannot see this ever happening
          throw new Error(
            `Cannot find an alternative for number ${aPrimeNumber} and words ending with ${usedEnding}`
          );
        }
      }

      /* EG
        {word: 'scott', score: 627}
      */

      wordUsage.add(verify.word);

      // Add the new prime number and word
      // However use a random colour
      randomNum = (Math.random() * wordColoursSize) << 0;

      primesWithWords.push({
        number: aPrimeNumber,
        text: capitalise(verify.word),
        // colour: "buzz-colour",
        // USE A RANDOM COLOUR
        // Randomly pick a colour
        colour: wordColours[randomNum],
      });
    } catch (err) {
      setErr(err.message);
    }
  };

  // Use 'Promise.all' to handle the Fetch APIs and a list of Promises
  const handlePrimes = async (setListReady) => {

    // resultsList contains [{{number:3}...},{{number:5}...},{{number:9}...}, ...]
    // primeNumbers contains [3, 5, 7, 11, 13, 17, 19, 23 ... 199]
    // Therefore when creating Promises for 'primeNumbers' ignore 3 and 5 i.e. slice(2)
 
    Promise.all(primeNumbers.slice(2).map((aPrime) => fetchWord(aPrime)))
      .then((results) => {

        // resultsList contains [{{number:3}...},{{number:5}...},{{number:9}...}, ...,
        //                       {{number:195}...}]
        // In ascending order

        // primesWithWords contains [{{number:7}...}, ... {{number:199}...}, ... {{number:191}...},
        //                       {{number:173}}, ...]
        // That is, in a random order

        // MERGE & SORT
        sortProcessDisplay(setListReady);
      })
      .catch((err) => {
        setErr(err.message);
      });
  };

  const fetchText = (divisor, element) => {
    let result =
      divisor === 3 || divisor === 5
        ? resultsList.find((element) => element.number === divisor)
        : primesWithWords.find((element) => element.number === divisor);
    // Return the word(s) only not the number 
    // FORM: number:Word(s) beginning with capital letter    
    return /[A-Z][a-z]*/.exec(result.text)[0];
  };

  /*
  When sorted the resultant list will look like this:
   Array(99)
   0: {number: 3, text: '3:Fizz', colour: 'fizz-colour'}
   1: {number: 5, text: '5:Buzz', colour: 'buzz-colour'}
   2: {number: 7, text: 'Whizz', colour: 'aqua-colour'}
   3: {number: 9, text: '9:Fizz', colour: 'fizz-colour'}
   4: {number: 11, text: 'Dwell', colour: 'deeporange-colour'}
   5: {number: 13, text: 'Scott', colour: 'bluegrey-colour'}
   6: {number: 15, text: '15:FizzBuzz', colour: 'fizzbuzz-colour'}
   7: {number: 17, text: 'Glass', colour: 'bluegrey-colour'}
   8: {number: 19, text: 'Frizz', colour: 'aqua-colour'}
   ...
  */

  const sortProcessDisplay = (setListReady) => {
    // Add the numbers to the words chosen for each prime number
    // i.e. number: 7, text: 'Whizz', ... =>
    //      number: 7, text: '7:Whizz', ...
    primesWithWords = primesWithWords.map((element) =>
      Object.assign(element, {
        text: String(element.number) + ":" + element.text,
      })
    );

    // Regarding the composite numbers, add each prime number factor word
    // e.g.  77 - add the words chosen for the prime numbers 7 & 11
    // e.g. 105 - add the word chosen for the prime number 7
    // e.g. 143 - add the words chosen for the prime numbers 11 & 13

    // resultsList contains [{{number:3}...},{{number:5}...},{{number:9}...}, ...,
    //                       {{number:195}...}]
    // So ignore numbers 3 and 5 - these are the only primes present in 'resultsList'

    resultsList = resultsList.map(
      (element) => {
        let { number, text, colour } = element;

        if (number === 3 || number === 5 || number === 15) {
          // edge cases i.e. Fizz, Buzz, FizzBuzz
          return element;
        }

        let changed = false;
        let i = -1; // use to signal to use 15 as the divisor
        let quotient = number;

        do {
          // (i === -1) // Special case 15 for the FizzBuzz numbers e.g. 15, 30, 45, ...
          let divisor = i === -1 ? 15 : primeNumbers[i];

          if (quotient % divisor === 0) {
            do {
              quotient /= divisor;
            } while (quotient % divisor === 0);

            // Ensure that the number is NOT a Fizz/Buzz number
            // That is, a number divisible by 3 or 5 or 15

            if (divisor !== 3 && divisor !== 5 && divisor !== 15) {
              // The number qualifies; therefore add the prime number word
              changed = true;
              let appendWord = fetchText(divisor, element);
              // Add a colon if not already present
              if (!text.includes(":")) {
                text += ":";
              }
              text += appendWord;
            }
          }
          i++; // next prime number slot
        } while (quotient !== 1);

        return !changed
          ? element // leave as is
          : {
              number: number,
              colour: colour,
              text: text, // new text
            };
      }
    );

    // merge and sort lists into numerical order
    const sortedList = [...resultsList, ...primesWithWords].sort(function (
      a,
      b
    ) {
      return a.number - b.number;
    });

    // Render the list
    setListReady(sortedList);
  };

  const ProcessNumbers = ({ setListReady }) => {
    // Go through the odd numbers in the range 3 to 199
    // Determine the prime numbers
    primeNumbers = Array.from({ length: 200 }, (_, i) => i); // Produce range 0-199

    // Good 'ol Sieve of Eratosthenes
    // However this version works with odd numbers
    primeNumbers = sieveEratosthenes(primeNumbers);

    // Odd Numbers Only 3 to 201
    for (let number = 3; number <= 201; number += 2) {
      let nonPrime = false;
      let newEntry;
      if (number % 3 === 0 && number % 5 === 0) {
        newEntry = {
          number: number,
          text: String(number) + ":FizzBuzz", // 2 spaces
          colour: "fizzbuzz-colour",
        };
        nonPrime = true;
      } else if (number % 3 === 0) {
        newEntry = {
          number: number,
          text: String(number) + ":Fizz",
          colour: "fizz-colour",
        };
        nonPrime = true;
      } else if (number % 5 === 0) {
        newEntry = {
          number: number,
          text: String(number) + ":Buzz",
          colour: "buzz-colour",
        };
        nonPrime = true;
      } else {
        newEntry = { number: number, text: String(number), colour: "" };
      }

      if (
        nonPrime ||
        !(
          // If None are ALL TRUE?
          (
            number > 1 &&
            number % 2 !== 0 && // even numbers - ignore!
            primeNumbers.includes(number)
          )
        )
      ) {
        resultsList.push(newEntry);
      }
    }

    // resultsList contains [{{number:3}...},{{number:5}...},{{number:9}...}, ...]

    /* 
      Now process all the prime numbers
      That is, perform a Fetch API for a random word to associate with each prime number
      Check that the words have NOT been used for a previous prime number
      I have decided to use 'Promise.all' for this process - see handlePrimes()
    */

    handlePrimes(setListReady);
  };

  return (
    <>
      {/* Error Handling */}
      {err && <h2>{err}</h2>}

      {/* Show Spinner Until All The Prime Numbers have been determined */}
      {!err && !listReady && (
        <div className="centre-spinner">
          <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
          <ProcessNumbers setListReady={setListReady} />
        </div>
      )}

      {/* Display the Results */}
      {!err && listReady && <Output result={listReady} />}
    </>
  );
}

export default App;
