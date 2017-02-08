---
layout: post
title:  "Write your own compiler - Station #2: the parser"
description:  "Write your own compiler: the parser. Code genetation. AST. Abstract syntax tree. lisp. javascript."
date:   2017-02-08 08:12:21 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "DAD172A0-B2A9-4418-B175-453557BE5174"
author: "@viebel"
minified_plugin: true
---

## The plan

Our [journey]({% post_url 2017-01-25-tiny-compiler-intro %}) is made of 4 stations - each of them depending on the previous ones:

1. [The tokenizer]({% post_url 2017-01-25-tiny-compiler-tokenizer %}) (aka "Lexical Analysis"): converting an input code - in `LISP` syntax - into an array of tokens.
2. [The parser]({% post_url 2017-01-25-tiny-compiler-parser %}) (aka "Syntactic Analysis"): transforming an array of tokens into an Abstract Syntax Tree (AST).
3. [The emitter]({% post_url 2017-01-25-tiny-compiler-emitter %}) (aka "Code Generation"): string-ifying an AST into `C`-like code.
4. [The compiler]({% post_url 2017-01-25-tiny-compiler-compiler %}) (aka "You made it"): combining all the pieces together.

(The interactive code snippets are powered by a tool of mine named [KLIPSE](https://github.com/viebel/klipse).)

## The parser


Our `parser` is going to take an array of tokens and turn it into an **Abstract Syntax Tree** (an AST).

An array like this: 

`[{ type: 'paren', value: '(' }, ...]` 

should become a tree like that:

`{ type: 'Program', body: [...] }`


![tree](/assets/tree.jpg)

![ast](/assets/ast.png)

## Code organization

Our code is going to be organized this way:

1. `parseProgram`: receives an array of tokens and return a `Program` node with a `body` - calling `parseToken`
2. `parseToken`: receives a single token and according to its type calls either `parseNumber`, `parseString` or `parseExpression`
3. `parseNumber`: receives a token and returns a `Number` node
4. `parseString` receives a token and returns a `String` node
5. `parseExpression`: receives a token and returns an `Expression` node - calling `parseToken` recursively

Each parser (except `parseProgram`) returns an array with:

1. the updated current position
2. the parsed node

## Number and String parsers

Number and String parsing is really straightforward:

~~~eval-js
parseNumber = (tokens, current) => [current + 1,
                                    {type: 'NumberLiteral',
									                                     value: tokens[current].value,
																		                                     }]
~~~

~~~eval-js
parseNumber([{
  "type": "number",
    "value": "42",
	  }], 0)
~~~

~~~eval-js
parseString = (tokens, current) => [current + 1,
                                    {type: 'StringLiteral',
									                                     value: tokens[current].value,
																		                                     }]
~~~

~~~eval-js
parseString([{
  "type": "string",
    "value": "Hello World!",
	  }], 0)
~~~

## Expression parsing

Parsing an expression is much trickier because expressions can be nested like `(add 1 (subtract 3 2))`.

No worries: `javascript` supports recursions!!!

The code of `parseExpression` is going to:

1. Skip the first token - it is the opening parenthesis
2. Create a base node with the type `CallExpression`, and name from the current token
3. Recursivelly call `parseToken` until we encounter a closing parenthesis
4. Skip the last token - it is the closing parenthesis

Not so complicated. Right?

Here is the code:

~~~eval-js
parseExpression =  (tokens, current)  => {
	  let token = tokens[++current];
			  let node = {
			      type: 'CallExpression',
				      name: token.value,
					      params: [],
						    };							
							    token = tokens[++current];								  
									  while (!(token.type === 'paren' && token.value ===')')) {
											      [current, param] = parseToken(tokens, current);
												      node.params.push(param);
													      token = tokens[current];
														    }									
																  current++;
																    return [current, node];
																	}
~~~


Unfortunately, we cannot test `parseExpression` until we implement `parseToken` (because of the recursion)...

## Token parsing

The code of `parseToken` is really simple, calls the parser that corresponds to the token type:

~~~eval-js
parseToken = (tokens, current) => {
  let token = tokens[current];
    if (token.type === 'number') {
	    return parseNumber(tokens, current);
		  }
		    if (token.type === 'string') {
			    return parseString(tokens, current);
				  }
				    if (token.type === 'paren' && token.value === '(') {
					    return parseExpression(tokens, current);
						  }
						    throw new TypeError(token.type);
							}
~~~

Let's test `parseExpression` - first with a simple expression:

~~~eval-js
const tokens =  [
  { type: 'paren',  value: '('        },
    { type: 'name',   value: 'subtract' },
	  { type: 'number', value: '4'        },
	    { type: 'number', value: '2'        },
		  { type: 'paren',  value: ')'        }, 
		  ]
		  parseExpression(tokens, 0)
~~~

And now - with a nested expression:

~~~eval-js
const tokens =  [
  { type: 'paren',  value: '('        },
    { type: 'name',   value: 'add'      },
	  { type: 'number', value: '2'        },
	    { type: 'paren',  value: '('        },
		  { type: 'name',   value: 'subtract' },
		    { type: 'number', value: '4'        },
			  { type: 'number', value: '2'        },
			    { type: 'paren',  value: ')'        }, 
				  { type: 'paren',  value: ')'        }, 
				  ]
				  parseExpression(tokens, 3)
~~~

## Program parsing

A program is composed by a series of expressions, therefore `parseProgram` is going to call `parseToken` until all the tokens are parsed:

~~~eval-js
function parseProgram(tokens) {
  let current = 0;
    let ast = {
	    type: 'Program',
		    body: [],
			  };
			    let node = null;
				  while (current < tokens.length) {
				      [current, node] = parseToken(tokens, current);
					      ast.body.push(node);
						    }
							  return ast;
							  }
~~~

Let's give `parseProgram` a nickname:

~~~eval-js
parser = parseProgram
~~~

Let's test `parseProgram`:

~~~eval-js
const tokens =  [
   { type: 'paren',  value: '('        },
     { type: 'name',   value: 'print'      },
	   { type: 'string', value: 'Hello'      },
	     { type: 'number', value: '2'        },
		   { type: 'paren',  value: ')'        }, 
		     { type: 'paren',  value: '('        },
			   { type: 'name',   value: 'add'      },
			     { type: 'number', value: '2'        },
				   { type: 'paren',  value: '('        },
				     { type: 'name',   value: 'subtract' },
					   { type: 'number', value: '4'        },
					     { type: 'number', value: '2'        },
						   { type: 'paren',  value: ')'        }, 
						     { type: 'paren',  value: ')'        }, 
							 ]
							 parseProgram(tokens, 0)
~~~

We did it! 
We have written a parser for our Lisp-like language...
