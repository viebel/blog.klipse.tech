---
layout: post
title:  "A tiny compiler: the tokenizer"
description:  "A tiny compiler: the tokenizer"
date:   2017-01-25 05:12:21 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "0324A2D5-5A29-445C-A043-D12D76EDE699"
author: "@viebel"
minified_plugin: true
hidden: true
draft: true
---

Inspired by https://github.com/thejameskyle/the-super-tiny-compiler
https://babeljs.io/docs/plugins/
## The tokenizer

We're gonna start off with our first phase of parsing, lexical analysis, with the **tokenizer**.

We're just going to take our string of code and break it down into an array of tokens.

There a three kinds of tokens:

1. single-character token: `(` and `)`
2. multiple character token: `123` or `abcd`
3. a string: something that starts with a `"` and end with a `"` (no escaping!)


First, we are going to write a couple of tokenizer for a single token. Each tokenizer receives the code as a string and the current position and returns:

1. the length of the token
2. the token as an object with two keys: `type` and `value`

### Single-character token

Let's write a generic function that tokenize a single character:

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

We will describe our multi-character token by means or regular expressions:

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
const tokenizers = [skipWhiteSpace, tokenizeParenOpen, tokenizeParenClose, tokenizeString, tokenizeNumber, tokenizeName];
~~~

The code tokenizer is going go over its input and try all the tokenizers and when it finds a match it will:

1. push the token object
2. update the current position

Here is the code:

~~~eval-js
tokenize_code = (input) => {
  let current = 0;
    let tokens = [];
	  while (current < input.length) {
	      let tokenized = false;
		      tokenizers.forEach(tokenizer_fn => {
			        if (tokenized) {return;}
					      let [consumedChars, token] = tokenizer_fn(input, current);
						        if(consumedChars !== 0) {
								        tokenized = true;
										        tokens.push(token);
												        current += consumedChars;
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
tokenize_code('(add 2 3)')
~~~

Our tokenizer doesn't do any semantic validation. As an example, it can read unbalanced parenthesis:

~~~eval-js
tokenize_code('(add 2')
~~~

Let's make sure we can handle nested expressions properly:

~~~eval-js
tokenize_code('(add 2 (subtract "314" 2))')
~~~

Hourra!!!
