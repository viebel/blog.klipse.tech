var authorDataInvalidBooks = {
  "firstName": "Albert",
  "lastName": "Einstein",
  "books": "Five"
};

ajv.validate(authorSchema, authorDataInvalidBooks); // <1>
// → false 
