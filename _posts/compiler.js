---
layout: post
title:  "Write your own compiler - Component #1: the tokenizer"
description:  "Write your own compiler: the tokenizer. Code genetation. AST. Abstract syntax tree. lisp. javascript."
date:   2017-02-08 08:11:21 +0200
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


## The tokenizer


The `tokenizer` receives a string of code and break it down into an array of tokens.

![tokens](/assets/tokens.jpg)


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
tokenizers = [skipWhiteSpace, tokenizeParenOpen, tokenizeParenClose, tokenizeString, tokenizeNumber, tokenizeName];
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
---
layout: post
title:  "Write your own compiler - Component #2: the parser"
description:  "Write your own compiler: the parser. Code genetation. AST. Abstract syntax tree. lisp. javascript."
date:   2017-02-08 08:12:21 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "DAD172A0-B2A9-4418-B175-453557BE5174"
author: "@viebel"
minified_plugin: true
---

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
---
layout: post
title:  "Write your own compiler - Component #3: the emitter"
description:  "Writing your own compiler: the emitter. Code genetation. AST. Abstract syntax tree. lisp. javascript."
date:   2017-02-08 08:13:21 +0200
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

## Code generation

Now that we have our AST, it's not so hard to transform the AST into code (if you are not afraid of recursions). This is the purpose of the `emitter`.

We are going to have an emitter per node type.

![emitter](/assets/emitter.jpg)

## Simple node emitters

First, Let's write the non-recursive emitters.

For `NumberLiteral` nodes - we emit the value as-is:

~~~eval-js
emitNumber = node => node.value
~~~

Let's see how it works:
~~~eval-js
emitNumber({
  "type": "number",
  "value": "2",
  })
~~~

For `StringLiteral` nodes - we wrap the node value with quotes:

~~~eval-js
emitString = node =>  `"${node.value}"`
~~~

Let's see how it works:

~~~eval-js
emitString({
  "type": "string",
  "value": "Hello World!",
  })
~~~

## Recursive node emitters

And now the recursive emitters.

For the whole program - we emit the code of each expression appending a `;` and joining the expressions with `\n`:

~~~eval-js
emitProgram = node =>  node.body.map(exp => emitter(exp) + ";").join('\n');
~~~

For an expression - this is where we deal with the facts that in `C`:
1. the function name comes before the parenthesis
2. the function arguments are comma separated

~~~eval-js
emitExpression = node =>
  `${node.name}(${node.params.map(emitter).join(', ')})`
~~~

## General node emitter

Combining all of it in the `emitter` - dispatching according to node type:

~~~eval-js
emitter = node => {
  switch (node.type) {
    case 'Program': return emitProgram(node); 
    case 'CallExpression': return emitExpression(node);
    case 'NumberLiteral': return emitNumber(node);
    case 'StringLiteral': return emitString(node); 
    default:
      throw new TypeError(node.type);
                   }
}
~~~

Let's see how our `emitter` works with a simple expression:

~~~eval-js
emitter({
          "type": "CallExpression",
          "name": "subtract",
          "params": [
            {
              "type": "NumberLiteral",
              "value": "4"
            },
            {
              "type": "NumberLiteral",
              "value": "2"
            }
          ]
        })
~~~

And now, let's emit the code from the AST generated by our parser in the [previous article]({% post_url 2017-01-25-tiny-compiler-parser %}):

~~~eval-js
ast = {
	"type": "Program",
	"body": [
		{
			"type": "CallExpression",
			"name": "print",
			"params": [
				{
					"type": "StringLiteral",
					"value": "Hello"
				},
				{
					"type": "NumberLiteral",
					"value": "2"
				}
			]
		},
		{
			"type": "CallExpression",
			"name": "add",
			"params": [
				{
					"type": "NumberLiteral",
					"value": "2"
				},
				{
					"type": "CallExpression",
					"name": "subtract",
					"params": [
						{
							"type": "NumberLiteral",
							"value": "4"
						},
						{
							"type": "NumberLiteral",
							"value": "2"
						}
					]
				}
			]
		}
	]
}
emitter(ast)
~~~
