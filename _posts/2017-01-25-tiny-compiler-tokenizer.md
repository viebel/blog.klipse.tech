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

## The tokenizer

 We're gonna start off with our first phase of parsing, lexical analysis, with
 the tokenizer.

 We're just going to take our string of code and break it down into an array
 of tokens.

  `(add 2 (subtract 4 2))` should become  `[{ type: 'paren', value: '(' }, ...]`


We start by accepting an input string of code, and we're gonna set up two things...


~~~eval-js
tokenizeCharacter = (type, value, charInput) =>
(value === charInput) ? [1, {type, value}] : [0, null]
~~~

~~~eval-js
tokenizeParenOpen = (input, current) => tokenizeCharacter('paren', '(', input, current)
~~~

~~~eval-js
tokenizeParenOpen('(', 0)
~~~

~~~eval-js
tokenizeParenClose = (input, current) => tokenizeCharacter('paren', ')', input, current)
~~~

~~~eval-js
tokenizeParenClose(')', 0)
~~~

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

~~~eval-js
tokenizeNumber = (input, current) => tokenizePattern("number", /[0-9]/, input, current)
~~~

~~~eval-js
tokenizeNumber("123aad", 0)
~~~

~~~eval-js
tokenizeName = (input, current) => tokenizePattern("name", /[a-z]/i, input, current)
~~~

~~~eval-js
tokenizeName('hello world', 0)
~~~

~~~eval-js
skipWhiteSpace = (charInput) =>   (/\s/.test(charInput)) ? [1, null] : [0, null]
~~~

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

~~~eval-js
function tokenizer(input) {
  let current = 0;
    let tokens = [];
      while (current < input.length) {
          let char = input[current];
	      let token = null;
	          let consumedChars = 0;

    [consumedChars, token] = tokenizeParenOpen(input[current]);
        if (token) {
	      tokens.push(token);
	          }
		      if(consumedChars !== 0) {
		            current += consumedChars;
			          continue;
				      }

    [consumedChars, token] = tokenizeParenClose(input[current]);
        if (token) {
	      tokens.push(token);
	          }
		      if(consumedChars !== 0) {
		            current += consumedChars;
			          continue;
				      }

    [consumedChars, token] = skipWhiteSpace(input[current]);
        if (token) {
	      tokens.push(token);
	          }
		      if(consumedChars !== 0) {
		            current += consumedChars;
			          continue;
				      }
				          [consumedChars, token] = tokenizeString(input, current);
					      if (token) {
					            tokens.push(token);
						        }
							    if(consumedChars !== 0) {
							          current += consumedChars;
								        continue;
									    }

    [consumedChars, token] = tokenizeNumber(input, current);
        if (token) {
	      tokens.push(token);
	          }
		      if(consumedChars !== 0) {
		            current += consumedChars;
			          continue;
				      }

    [consumedChars, token] = tokenizeName(input, current);
        if (token) {
	      tokens.push(token);
	          }

    if(consumedChars !== 0) {
          current += consumedChars;
	        continue;
		    }

    // Finally if we have not matched a character by now, we're going to throw     // an error and completely exit.
        throw new TypeError('I dont know what this character is: ' + char);
	  }
	      return tokens;
	      }
~~~

Let's see our tokenizer in action:

~~~eval-js
tokenizer('(add 2 (subtract "314" 2))')
~~~
