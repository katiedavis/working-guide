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

We’ll use webpack 4 for this. Webpack is an open-source Javascript module
bundler. It consumes your client side code, traverses it’s dependencies, and
generates static assets representing those modules. So, add webpack:
`yarn add webpack webpack-cli` (if you're using webpack v4 or later, you'll need
to install the CLI.) Install babel:
[https://babeljs.io/en/setup#installation](https://babeljs.io/en/setup#installation)
At the time of writing this guide, babel gives you an interface to choose your
desired set up. We want to use webpack, so after selecting that our command
would be: `yarn add babel-loader babel-core`

ie: Choose your tool -> webpack Installation ->
`yarn add babel-loader babel-core`

Create `webpack.config.js` file and add:

```
module: {
    rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
}
```

Create a .babelrc file and add some plugins: `yarn add @babel/preset-env --dev`

For more information see:
[https://babeljs.io/docs/en/babel-preset-env/](https://babeljs.io/docs/en/babel-preset-env/)

In order to enable the preset you have to define it in your .babelrc file, like
this: `{ "presets": ["env"] }`

We then want to specific which _stage_ of babel presets you want to use. Lets
use stage 2 for this. You can read more about stage 2
[here](https://babeljs.io/docs/en/babel-preset-stage-2)

in your .babelrc file:

```
{
  "presets": [
    "env",
   **"@babel/preset-stage-2"**
  ]
}
```

---

Step 6. Add .env file, and get our API Key and Secret from the Partners
Dashboard

Storing configuration in the environment separate from code is based on The
[Twelve-Factor App methodology](https://12factor.net/config).

Before creating a `.env` let’s add it to our `.gitignore`

Let’s add a `.env` file

The `.env` file will contain:

```
SHOPIFY_API_KEY=YOUR_SHOPIFY_API_KEY
SHOPIFY_SECRET=YOUR_SHOPIFY_SECRET
```

To get a Shopify API Key and Secret you need to create an app in the
[Partners Dashboard](https://www.shopify.ca/partners).

Once you're logged into the Shopify Partners dashboard click "Apps" from the
main dashboard navigation. Then click "Create app".

Give your app a name, this can be anything you'd like. We will call our app
`cool-fun-example app`. The interface will provide you both an `API_KEY` and
`SHOPIFY_SECRET`. Add those to the key value pairs in your `.env` file.

Next, we're going to add the `dotenv` package:

`yarn add dotenv`

Dotenv is a zero-dependency module that loads environment variables from a .env
file into
[process.env](https://nodejs.org/docs/latest/api/process.html#process_process_env).
This will help us later when we need to use our API key and secret variables.

---

Step 7. Add Dev Dependencies

#### babel-cli

http://babeljs.io/docs/en/babel-cli/ - I don’t really understand what this does
`yarn add --dev babel-cli`

#### Nodemon

nodemon is a tool that helps develop node.js based applications by automatically
restarting the node application when file changes in the directory are detected.

`yarn add --dev nodemon`

#### Prettier

Prettier is a package that helps keep your code clean and easy to read. It can
be very helpful for projects with many developers working in the same files. No
fights over spaces vs tabs because it's all preconfigured! You don't need to use
prettier, but this is the config we use at Shopify:

`yarn add --dev prettier`

create a `.prettierrc` file and add:

```
{
  "arrowParens": "always",
  "singleQuote": true,
  "bracketSpacing": false,
  "trailingComma": "all"
}
```

---

Step 8. Some extras

Let’s add an editor config file, do we need this?

https://github.com/Shopify/unite-react-node-app-workshop/blob/master/.editorconfig

---

More info:

- [babel](https://babeljs.io/) lets us use modern syntax and JSX everywhere
- [webpack](https://webpack.js.org/) compiles our client-side code into a bundle
- [prettier](https://prettier.io/) make our code look pretty and maintains
  consistency
- [dotenv](https://github.com/motdotla/dotenv) helps configure our environment
  variables
- [koa](https://koajs.com/) minimalistic and modern node server framework
