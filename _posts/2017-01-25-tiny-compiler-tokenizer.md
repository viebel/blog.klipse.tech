---
layout: post
title:  "Write your own compiler - Station #1: the tokenizer"
description:  "Write your own compiler: the tokenizer. Code genetation. AST. Abstract syntax tree. lisp. javascript."
date:   2017-02-08 08:11:21 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "DAD172A0-B2A9-4418-B175-453557BE5174"
author: Yehonathan Sharvit
minified_plugin: true
---

## The plan

Our [journey]({% post_url 2017-01-25-tiny-compiler-intro %}) is made of 4 stations - each of them depending on the previous ones:

1. [The tokenizer]({% post_url 2017-01-25-tiny-compiler-tokenizer %}) (aka "Lexical Analysis"): converting an input code - in `LISP` syntax - into an array of tokens.
2. [The parser]({% post_url 2017-01-25-tiny-compiler-parser %}) (aka "Syntactic Analysis"): transforming an array of tokens into an Abstract Syntax Tree (AST).
3. [The emitter]({% post_url 2017-01-25-tiny-compiler-emitter %}) (aka "Code Generation"): string-ifying an AST into `C`-like code.
4. [The compiler]({% post_url 2017-01-25-tiny-compiler-compiler %}) (aka "You made it"): combining all the pieces together.

(The interactive code snippets are powered by a tool of mine named [KLIPSE](https://github.com/viebel/klipse).)

## The tokenizer


The `tokenizer` receives a string of code and breaks it down into an array of tokens.

![tokens](/assets/tokens.jpg)


There are three kinds of tokens:

1. single-character token: `(` and `)`
2. multiple character token: `123` or `abcd`
3. a string: something that starts with a `"` and ends with a `"` (no escaping!)


First, we are going to write a couple of tokenizers for a single token. Each tokenizer receives the code as a string and the current position and returns:

1. the length of the token
2. the token as an object with two keys: `type` and `value`

### Single-character token

Let's write a generic function that tokenizes a single character:

~~~eval-js
tokenizeCharacter = (type, value, input, current) =>
(value === input[current]) ? [1, {type, value}] : [0, null]
~~~

Here is the tokenizer for `(`:

~~~eval-js
tokenizeParenOpen = (input, current) => tokenizeCharacter('paren', '(', input, current)
~~~

~~~eval-js
tokenizeParenOpen('(', 0)
~~~

And here is the tokenizer for `)`:

~~~eval-js
tokenizeParenClose = (input, current) => tokenizeCharacter('paren', ')', input, current)
~~~

~~~eval-js
tokenizeParenClose(')', 0)
~~~

## Multiple character tokens:

We will describe our multi-character token by means of regular expressions:

Here is a generic regexp tokenizer:

~~~eval-js
tokenizePattern = (type, pattern, input, current) => {
  let char = input[current];
    let consumedChars = 0;
      if (pattern.test(char)) {
          let value = '';
	      while (char && pattern.test(char)) {
	            value += char;
		          consumedChars ++;
			        char = input[current + consumedChars];
				    }
				        return [consumedChars , { type, value }];
					  }
					    return [0, null]
					    }
~~~

And here is the `number` tokenizer:

~~~eval-js
tokenizeNumber = (input, current) => tokenizePattern("number", /[0-9]/, input, current)
~~~

~~~eval-js
tokenizeNumber("123aad", 0)
~~~

And the `name` tokenizer (in our language names are chains of letters):

~~~eval-js
tokenizeName = (input, current) => tokenizePattern("name", /[a-z]/i, input, current)
~~~

~~~eval-js
tokenizeName('hello world', 0)
~~~


### String tokenizer

A string is something that starts with a `"` and ends with a `"` (no escaping in our language!):

~~~eval-js
tokenizeString = (input, current) => {
  if (input[current] === '"') {
    let value = '';
    let consumedChars = 0;
    consumedChars ++;
    char = input[current + consumedChars];
    while (char !== '"') {
          if(char === undefined) {
	          throw new TypeError("unterminated string ");
		        }
			      value += char;
			            consumedChars ++;
				          char = input[current + consumedChars];
					      }
					          return [consumedChars + 1, { type: 'string', value }];
						    }
						      return [0, null]
						      }
~~~

~~~eval-js
tokenizeString('"Hello World"', 0)
~~~

Last thing,  we want to skip whitespaces:

~~~eval-js
skipWhiteSpace = (input, current) =>   (/\s/.test(input[current])) ? [1, null] : [0, null]
~~~


### The tokenizer

Let's put all our tokenizers into an array:

~~~eval-js
tokenizers = [skipWhiteSpace, tokenizeParenOpen, tokenizeParenClose, tokenizeString, tokenizeNumber, tokenizeName];
~~~

The code tokenizer is going go over its input and try all the tokenizers and when it finds a match it will:

1. push the token object
2. update the current position

Here is the code:

~~~eval-js
tokenizer = (input) => {
  let current = 0;
  let tokens = [];
  while (current < input.length) {
    let tokenized = false;
    tokenizers.forEach(tokenizer_fn => {
      if (tokenized) {return;}
      let [consumedChars, token] = tokenizer_fn(input, current);
      if(consumedChars !== 0) {
        tokenized = true;
        current += consumedChars;
      }
      if(token) {
        tokens.push(token);
      }
    });
    if (!tokenized) {
      throw new TypeError('I dont know what this character is: ' + char);
    }
  }
  return tokens;
}
~~~

Let's see our tokenizer in action:

~~~eval-js
tokenizer('(add 2 3)')
~~~

Our tokenizer doesn't do any semantic validation. As an example, it can read unbalanced parenthesis:

~~~eval-js
tokenizer('(add 2')
~~~

Let's make sure we can handle nested expressions properly:

~~~eval-js
tokenizer('(add 2 (subtract "314" 2))')
~~~

Hourra!!!

Please take a short rest before moving towards [Station #2: The parser]({% post_url 2017-01-25-tiny-compiler-parser %}).
