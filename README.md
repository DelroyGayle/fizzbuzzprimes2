# Having Fun with Fizz Buzz

I came across this apparently common JavaScript interview puzzle regarding "FizzBuzz"

[FizzBuzz: One Simple Interview Question](https://www.youtube.com/watch?v=QPZ0pIK_wsc)

FizzBuzz is a game whereby two people count up in turn 1, 2, 3, 4, 5, ... saying the numbers.\
When one reaches a multiple of three, one says "Fizz" instead of the number;\
and when one reaches a multiple of five, one says "Buzz" instead of the number.\
Moreover, when it is a multiple of both i.e. 15, one says "FizzBuzz"

A gentleman by the name of [Imran Ghory](https://imranontech.com/2007/01/24/using-fizzbuzz-to-find-developers-who-grok-coding/) proposed that anyone going for a job in computer programming should be able to:

> **write a program that outputs the correct words according to "FizzBuzz" for the numbers 1 to 100.**

This generated some interesting results and essays - see the references for more information.

In my estimation, I managed to write a solution.

Being intrigued with FizzBuzz, I  wrote the following variations to "FizzBuzz":

## FizzBuzzV1
See [FizzBuzzV1](https://github.com/DelroyGayle/FizzBuzzV1) for further details.

## FizzBuzzV2 i.e. FizzBuzzPrimes
See [FizzBuzzPrimes](https://github.com/DelroyGayle/fizzbuzzprimes2) for further details.

## FizzBuzzV3 i.e. FizzBuzzPrimes2

FizzBuzzPrimes2 is a React program which displays 100 buttons representing\
the odd numbers from 3 to 201.\
Cyan buttons labelled "FizzBuzz" are shown for numbers that are multiples of 3 and 5\
i.e. multiples of 15

Orange buttons labelled 'Fizz' are shown for numbers that are multiples of 3\
Yellow buttons labelled 'Buzz' are shown for numbers that are multiples of 5

However odd prime numbers are given randomly coloured buttons with a random word ending with two identical letters

If a number has a multiple of prime factors e.g. such as 93 = (3 x 31)\
Then two words, Fizz (because it a multiple of 3) and the word attached to 31 are displayed together

In like manner a number such as 105 (3 X 5 X 7) has two words displayed together:\
FizzBuzz (because it a multiple of 15) and the word attached to 7 

## References

[Using FizzBuzz to Find Developers who Grok Coding - January 24, 2007](https://imranontech.com/2007/01/24/using-fizzbuzz-to-find-developers-who-grok-coding/)

[Don't Overthink FizzBuzz - January 24, 2007](http://weblog.raganwald.com/2007/01/dont-overthink-fizzbuzz.html)

[Why Can't Programmers.. Program? - 26 Feb 2007](https://blog.codinghorror.com/why-cant-programmers-program/)

[FizzBuzz: the Programmer's Stairway to Heaven - 27 Feb 2007](https://blog.codinghorror.com/fizzbuzz-the-programmers-stairway-to-heaven/)

[10 Python solutions](https://github.com/joelgrus/fizzbuzz) from Joel Grus' book
[Ten Essays on Fizz Buzz](https://fizzbuzzbook.com).
Please enjoy them.

[Ten Essays on Fizz Buzz](https://fizzbuzzbook.com)
Meditations on Python, mathematics, science, engineering, and design

# Here is a sample output of this program

![image](https://user-images.githubusercontent.com/91061592/196307117-627e607b-a651-400b-9108-464c6416890e.png)

