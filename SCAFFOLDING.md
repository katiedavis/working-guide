## Install Node (and npm)

Step 1. Install the latest version of Node. Install the latest LTS version of
node from the official site. This will include the npm client we'll use to
install dependencies `nvm use 8.11.3` (as of writing this 8.11.3 is currently
the stable version)

** use `nvm current` to see what version of node you’re using ** use `nvm ls` to
see what the latest version \*\* use `nvm --help` to see all commands

---

Step 2. Add package.json by running `npm init`

You'll be asked to answer some questions via the command line to build your
`package.json`:

Example: name: (example-app-workshop) <- your repo name is the default { "name":
"example-app-workshop", }

---

Step 3. Add .gitignore and ignore node_modules

Add a `.gitignore` file with `node_modules` in the body of the file, this
ensures you don't commit a million packages to git. We will also use this later
in this workshop to ignore our `.env` file.

---

Step 4. Add yarn if you prefer it over npm Check out
https://yarnpkg.com/en/docs/install#mac-stable for installing yarn

Once yarn is installed, run

yarn

---

Step 5. Add babel, add webpack, configure webpack to use babel-loader.

We want to run our js files through the babel-loader so that we can use modern
JS syntax. This package transpiles our Javascript through webpack!

`yarn add webpack webpack-cli` (if you're using webpack v4 or later, you'll need
to install the CLI.) Install babel.
[https://babeljs.io/en/setup#installation](https://babeljs.io/en/setup#installation)
At the time of writing this guide, babel gives you an interface to choose your
desired set up. We want to use webpack, so after selecting that our command
would be: `yarn add babel-loader babel-core`

ie: Choose your tool -> webpack Installation ->
`yarn add babel-loader babel-core`

Create `webpack.config.js` file and add

````module: {
  rules: [
    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
  ]
}```
````
