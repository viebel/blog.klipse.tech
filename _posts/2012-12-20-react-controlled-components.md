---
layout: post
title:  "React.js controlled components"
description:  "React.js controlled components. HTML Forms. Input. Textarea. Select."
date:   2016-12-20 16:45:32 +0200
categories: react
thumbnail: assets/klipse.png
guid: "BE44FF26-5087-4176-B720-6E1308C8A2FF"
author: Yehonathan Sharvit
minified_plugin: true
---

# Prelude

This article is an interactive version of Facebook official tutorial about [React.js controlled components](https://facebook.github.io/react/docs/forms.html) using the [KLIPSE plugin](https://github.com/viebel/klipse) to make the code snippets interactive: the JSX code will be transpiled in your browser while you read this article and a couple of react components will be rendered.


In the original tutorial, you have to launch the CodePen editor in another tab in order to test the code snippets.

In the present version of the tutorial, you can play with the code snippets inside the article itself!


I hope that you will enjoy the code interactivity...


# Introduction

HTML form elements work a little bit differently from other DOM elements in React, because form elements naturally keep some internal state. For example, this form in plain HTML accepts a single name:

~~~html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
~~~

This form has the default HTML form behavior of browsing to a new page when the user submits the form. If you want this behavior in React, it just works. But in most cases, it's convenient to have a JavaScript function that handles the submission of the form and has access to the data that the user entered into the form. The standard way to achieve this is with a technique called "controlled components".

In HTML, form elements such as `<input>`, `<textarea>`, and `<select>` typically maintain their own state and update it based on user input. In React, mutable state is typically kept in the state property of components, and only updated with [`setState()`](/react/docs/react-component.html#setstate).

We can combine the two by making the React state be the "single source of truth". Then the React component that renders a form also controls what happens in that form on subsequent user input. An input form element whose value is controlled by React in this way is called a "controlled component".

## Text Input

For example, if we want to make the previous example log the name when it is submitted, we can write the form as a controlled component:

<pre><code class="language-klipse-jsx" data-preamble="let container=document.getElementById('container1');">
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      &lt;form onSubmit={this.handleSubmit}&gt;
        &lt;label&gt;
          Name:
          &lt;input type="text" value={this.state.value} onChange={this.handleChange} /&gt;
        &lt;/label&gt;
        &lt;input type="submit" value="Submit" /&gt;
      &lt;/form&gt;
    );
  }
}

ReactDOM.render(React.createElement(NameForm, null), container);

</code></pre>

<div class="react-container" id="container1"></div>


Since the `value` attribute is set on our form element, the displayed value will always be `this.state.value`, making the React state the source of truth. Since `handleChange` runs on every keystroke to update the React state, the displayed value will update as the user types.

With a controlled component, every state mutation will have an associated handler function. This makes it straightforward to modify or validate user input. For example, if we wanted to enforce that names are written with all uppercase letters, we could write `handleChange` as:

~~~javascript
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
~~~

Here is the full code:

<pre><code class="language-klipse-jsx" data-preamble="let container=document.getElementById('container2');">
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      this.setState({value: event.target.value.toUpperCase()});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      &lt;form onSubmit={this.handleSubmit}&gt;
        &lt;label&gt;
          Name:
          &lt;input type="text" value={this.state.value} onChange={this.handleChange} /&gt;
        &lt;/label&gt;
        &lt;input type="submit" value="Submit" /&gt;
      &lt;/form&gt;
    );
  }
}

ReactDOM.render(React.createElement(NameForm, null), container);
</code></pre>

Give it a try in the component below:

<div class="react-container" id="container2"></div>

## The textarea Tag

In HTML, a `<textarea>` element defines its text by its children:

~~~html
<textarea>
  Hello there, this is some text in a text area
</textarea>
~~~

In React, a `<textarea>` uses a `value` attribute instead. This way, a form using a `<textarea>` can be written very similarly to a form that uses a single-line input:

<pre><code class="language-klipse-jsx" data-preamble="let container=document.getElementById('container3');">
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      &lt;form onSubmit={this.handleSubmit}&gt;
        &lt;label&gt;
          Name:
          &lt;textarea value={this.state.value} cols="40" onChange={this.handleChange} /&gt;
        &lt;/label&gt;
        &lt;input type="submit" value="Submit" /&gt;
      &lt;/form&gt;
    );
  }
}
ReactDOM.render(React.createElement(EssayForm, null), container);
</code></pre>


<div class="react-container" id="container3"></div>


Notice that `this.state.value` is initialized in the constructor, so that the text area starts off with some text in it.

## The select Tag

In HTML, `<select>` creates a drop-down list.

For example, this HTML creates a drop-down list of flavors:

~~~html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
~~~

Note that the Coconut option is initially selected, because of the `selected` attribute. React, instead of using this `selected` attribute, uses a `value` attribute on the root `select` tag. This is more convenient in a controlled component because you only need to update it in one place. 

For example:

<pre><code class="language-klipse-jsx" data-preamble="let container=document.getElementById('container4');">
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      &lt;form onSubmit={this.handleSubmit}&gt;
        &lt;label&gt;
          Pick your favorite La Croix flavor:
          &lt;select value={this.state.value} onChange={this.handleChange}&gt;
            &lt;option value="grapefruit"&gt;Grapefruit&lt;/option&gt;
            &lt;option value="lime"&gt;Lime&lt;/option&gt;
            &lt;option value="coconut"&gt;Coconut&lt;/option&gt;
            &lt;option value="mango"&gt;Mango&lt;/option&gt;
          &lt;/select&gt;
        &lt;/label&gt;
        &lt;input type="submit" value="Submit" /&gt;
      &lt;/form&gt;
    );
  }
}
ReactDOM.render(React.createElement(FlavorForm, null), container);
</code></pre>


<div class="react-container" id="container4"></div>


Overall, this makes it so that `<input type="text">`, `<textarea>`, and `<select>` all work very similarly - they all accept a `value` attribute that you can use to implement a controlled component.

## Alternatives to Controlled Components

It can sometimes be tedious to use controlled components, because you need to write an event handler for every way your data can change and pipe all of the input state through a React component. This can become particularly annoying when you are converting a preexisting codebase to React, or integrating a React application with a non-React library. In these situations, you might want to check out [uncontrolled components](https://facebook.github.io/react/docs/uncontrolled-components.html), an alternative technique for implementing input forms.


<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.1/react-with-addons.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.1/react-dom.js"></script>
