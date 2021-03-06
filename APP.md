# Building our app

Now that we have laid the ground work for our app, lets build a way to run it!
In order to do that, we need to add some scripts to our `package.json` file.

```diff
 "scripts": {
   "test": "echo \"Error: no test specified\" && exit 1",
+  "dev": "nodemon --exec babel-node index.js",
+  "start": "yarn run dev"
 },
```

For now, **start** is going to run **dev**, and dev is going to look at
`index.js` in the root for instruction and use _nodemon_ to automatically
restart the node application when file changes in the directory are detected.

---

### Creating our server

Create a `server` folder at the root level and inside that an `index.js` file:

ie: `./server/index.js`

Remember that API key and secret we est up in our `.env` file? We're finally
going to use them!

In `./server/index.js`:

```
import dotenv from 'dotenv';

dotenv.config();
```

👩🏻‍🏫 - config will read your `.env` file, parse the contents, assign it to
process.env, and return an Object with a parsed key containing the loaded
content or an error key if it failed.

Next, we're going to add a packaged called Koa to our project

```bash
yarn add koa
```

Koa is a minimalistic node framework for modern Javascript apps. It is built
around the ES2016 `async` and `await` keywords.

In Koa you express your application logic as a series of asynchronous functions
called middleware, which is just a fancy word for functions that all operate on
a `context` or `ctx` object, and await on a `next` function to yield flow back
into the rest of the app.

Lets console.log a simple ‘Hello Friends’ middleware to make sure everything is
working. More documentation can be found in the
[Koa documentation](https://github.com/koajs/koa#hello-koa)

```
import dotenv from 'dotenv';
import Koa from 'koa';

dotenv.config();

const app = new Koa();

app.use(function index(ctx) {
 console.log('Hello Friends 👋');
 ctx.body = 'Hello Friends 👋';
});

export default app;
```

(ADD INSTRUCTIONS HERE ON WHERE THIS CAN BE FOUND)

Now, lets add an `index.js` file at the root level of our project.

In the file, start a server listening for connections on a given port, we are
going to use `port 3000.`

We also need to add a package called [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) that adds fetch globally so it's consistent between client and server.

```bash
yarn add isomorphic-fetch
```

```
import server from './server';
import 'isomorphic-fetch';

const {PORT = 3000} = process.env;

server.listen(PORT, () => {
 console.log(`🚀 Listening on port ${PORT}`);
});
```

---

### Exposing our dev environment to the internet

At Shopify we typically use ngrok as a tunnel. You will need to download ngrok
at [https://ngrok.com/download](https://ngrok.com/download) and signup for a
free account. Move the unziped ngrok client to your user folder and run the
following in your terminal.

```bash
$ ./ngrok http 3000
```

This should display a UI in your terminal with the public URL of your tunnel and
other status and metrics information about connections made over your tunnel. It
should something like this: ![image of ngrok](assets/ngrok.png)

👩🏻‍🏫: This basically takes whatever is running on `locahost:3000` and puts it on
that `ngrok` url. You could send that url to a friend and they could take a look
at your work, or you could use it as the URL in your Shopify Partner account!

---

### Setting up our URL on the partners dashboard

Now that we've exposed our development enviroment to ngrok, lets go ahead and
add that url to the
[Shopify Partners dashboard](https://partners.shopify.com/organizations).

Once you're logged into the Shopify Partners dashboard click "Apps" from the
main dashboard navigation. Find your version of the `cool-fun-example-app` (the
same place we got our API_KEY from earlier)

Set the app URL to the public URL of your ngrok tunnel. This should be displayed
in the UI under "Fowarding" and should end with `.ngrok.io` for example
`https://ec4bed7e.ngrok.io`.

In this guide we'll be using `/auth/callback` as our oauth callback route, so
add that to your whitelist like this:
`https://YOUR_NGROK_ADDRESS/auth/callback`

![partners dash create app](assets/dash-setup.png)

---

### Starting the app

Ensure your packages are up to date by running `yarn install` and then your
start command, which should be `yarn start`

Open a browser and go to either [localhost:3000](localhost:3000) or the url
provided by ngrok.

If you head over to `localhost:3000` in your browser you should see:

```
Hello Friends 👋
```

and in your terminal you should see:

```
🚀 Listening on port 3000
```

---

### Lets build the app!

#### Step 1: Auth

So, earlier we set up our middleware with Koa. That works just fine, we've seen
our hello friends.

We're not going to use koa to authenticate ourselves and have our app show
itself in the Shopify store. Shopify has it's own koa-auth package that we will
use. Lets add it now along with [koa-session](https://github.com/koajs/session) which will handle cookie-based session :

```bash
yarn add koa-session @shopify/koa-shopify-auth
```

👩🏻‍🏫: You can learn more about the this package
[here](https://www.npmjs.com/package/@shopify/koa-shopify-auth) and koa-session [here](https://github.com/koajs/session).

In our `./server/index.js` add the following lines to your file:

```diff
  import dotenv from 'dotenv';
  import Koa from 'koa';
+ import session from 'koa-session';
+ import createShopifyAuth from '@shopify/koa-shopify-auth';

  dotenv.config();

  const app = new Koa();

  app.use(function index(ctx) {
   console.log('Hello Friends 👋');
   ctx.body = 'Hello Friends 👋';
  });

 export default app;
```

We can mount our middlware by adding the following lines after we intialize our
new Koa app.

```diff
  import dotenv from 'dotenv';
  import Koa from 'koa';
  import session from 'koa-session';
  import createShopifyAuth from '@shopify/koa-shopify-auth';

  dotenv.config();

  const app = new Koa();
+ app.use(session(app));

  app.use(function index(ctx) {
   console.log('Hello Friends 👋');
   ctx.body = 'Hello Friends 👋';
  });

 export default app;
```

We are mounting the session middleware and passing our Koa app instance into it.

Next we need to use the Shopify Auth Middleware that we imported. To configure it we'll need to
pass the apiKey, and our secret.

We can grab both our `SHOPIFY_SECRET` and `SHOPIFY_API_KEY` from the
environment. Remember that `dotenv` package? That's helping us out here.

```js
const {SHOPIFY_API_KEY, SHOPIFY_SECRET} = process.env;
```

Then we'll add the middleware to the app and pass in some configuration.

```js
app.use(
  createShopifyAuth({
    // your shopify app's api key
    apiKey: SHOPIFY_API_KEY,
    // your shopify app's api secret
    secret: SHOPIFY_SECRET,
    // our app's permissions
    // we need to write products to the user's store, there are more permissions you can add
    scopes: ['write_products'],
    // our own custom logic after authentication has completed
    afterAuth(ctx) {
      const {shop, accessToken} = ctx.session;

      console.log('We did it!', shop, accessToken);

      ctx.redirect('/');
    },
  }),
);
```

`afterAuth` here tells our app what to do when an authentication successfully
completes. We will just print a message and redirect to the root or our app.

With this done, we'll add `app.keys` to let us use session securely. Set this to
your Shopify secret _before_ we mount our session middleware.

```js
app.keys = [SHOPIFY_SECRET];
```

At this point, our `./server/index.js` file should look like this:

```js
import dotenv from 'dotenv';
import Koa from 'koa';
import session from 'koa-session';
import createShopifyAuth from '@shopify/koa-shopify-auth';

dotenv.config();

const {SHOPIFY_API_KEY, SHOPIFY_SECRET} = process.env;

const app = new Koa();
app.use(session(app));

app.keys = [SHOPIFY_SECRET];

app.use(
  createShopifyAuth({
    // your shopify app's api key
    apiKey: SHOPIFY_API_KEY,
    // your shopify app's api secret
    secret: SHOPIFY_SECRET,
    // our app's permissions
    // we need to write products to the user's store, there are more permissions you can add
    scopes: ['write_products'],
    // our own custom logic after authentication has completed
    afterAuth(ctx) {
      const {shop, accessToken} = ctx.session;

      console.log('We did it!', shop, accessToken);

      ctx.redirect('/');
    },
  }),
);

app.use(function index(ctx) {
  console.log('Hello Friends 👋');
  ctx.body = 'Hello Friends 👋';
});

export default app;
```

To try out our authenticate flow, lets visit
`YOUR_HTTPS_NGROK_URL/auth?shop=YOUR_SHOP_DOMAIN`.
(WE HAVE NEVER TALKED ABOUT A TEST STORE!)

You might see an error screen that states:

```
Oauth error invalid_request: The redirect_uri is not whitelisted
```

(OAUTH SCREENSHOT HERE)

To solve this we need to login to our partners dashboard, go to our App Info and
add `YOUR_HTTPS_NGROK_URL/auth/callback` to "Whitelisted redirection URL(s)"
textarea.

Now if you try to authenicate again,
(`YOUR_HTTPS_NGROK_URL/auth?shop=YOUR_SHOP_DOMAIN`) it should take you to
install the app in the Shopify admin. Which will look like this:
![install page](/assets/install.png)

Once its installed you can verify it shows
by going to to `YOUR_SHOPIFY_TEST_STORE/admin/apps`.

We now have an authentication route, but users can still go straight to our
index without logging in. You can verifiy this by clearing your cookies or
loading the your ngrok url in an icognito tab. The next step will protect our
`Hello friends` with a verification middleware.

👩🏻‍🏫: The `@shopify/koa-shopify-auth` package exports a middleware for this exact
purpose. For more info
[here](https://www.npmjs.com/package/@shopify/koa-shopify-auth)
in our `./server/index.js` file add:

```js
import createShopifyAuth, {
  createVerifyRequest,
} from '@shopify/koa-shopify-auth';
```

Now we can add the following between our Auth and Hello friends middlewares.

```js
// secure all middleware after this line
//what is the difference between creatcreateVerifyRequest and createVerifyRequest? I'm using createVerifyRequest
app.use(verifyRequest());
```

Everything below this middleware will require authentication, everything above
will not. Our index file should look like this:

```js
import dotenv from 'dotenv';
import Koa from 'koa';
import session from 'koa-session';
import createShopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';

dotenv.config();
const {SHOPIFY_SECRET, SHOPIFY_API_KEY} = process.env;

const app = new Koa();
app.use(session(app));

app.keys = [SHOPIFY_SECRET];

console.log(SHOPIFY_SECRET, SHOPIFY_API_KEY);

app.use(
  createShopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_SECRET,
    scopes: ['write_products'],
    afterAuth(ctx) {
      const {shop, accessToken} = ctx.session;

      console.log('We did it!', shop, accessToken);

      ctx.redirect('/');
    },
  }),
);

app.use(createVerifyRequest());

export default app;
```

You should now see your `console.log` with `shop` andd `accessToken` that are returned upon authentication!

🎉Congratulations!🎉 You have just built a app that will render in the Shopify
admin and knows how to authenicate with Shopify. Now lets actually work on
making our app do something.

#### Step 2 : Serving HTML with React

Maybe you have noticed we only have a server that serves up a string. We will
use React on the server togenerate our app markup. This will let us reuse our
code on the server and client and have one source of truth for the resulting UI.

As the quickest of primers, React is a component based library for declaratively
building user interfaces. Components are expressed as either functions of their
input (props) or as subclasses of `React.Component`. For more information on
React, check out
[it's documentation](https://reactjs.org/tutorial/tutorial.html). We've chosen
to use React for it's flexibilty as well as our React component library,
[Polaris](https://github.com/Shopify/polaris).

First, we need to add React and some React related packages to our project:

```bash
yarn add react react-dom
```

Lets also add react-router while we are here, it will provide client-side
routing once we start building out our front-end.

```bash
yarn add react-router
```

Lastly, since we know we are going to use React in this project, lets add the
babel-presets for it:

```bash
yarn add @babel/preset-react
```

Then, we can head back to our `.babelrc` file and add it to presets:

```
{
  "presets": [
    "env",
    “react”,
    "stage-2"
  ]
}
```

Okay cool! Some React stuff out of the way! But how are we going to use it in
our server? Middleware again. This middleware will generate markup run our react
code, lets install a Shopify package that helps us do this.

```bash
yarn add @shopify/react-html
```

👩🏻‍🏫:
[For more info on this package](https://www.npmjs.com/package/@shopify/react-html)

This middleware will be a bit larger than our others, so lets devote a new file
to it. Create a new file in the server directory called `render-react-app.js`
and add the following code.

```js
import React from 'react';
import {renderToString} from 'react-dom/server';
import HTML from '@shopify/react-html';

export default (ctx) => {
  const markup = renderToString(
    <HTML>
      <div>Hello this is React speaking to you</div>
    </HTML>,
  );

  ctx.body = markup;
};
```

👩🏻‍🏫: React-HTML provides us a component that replaces a standard static HTML
file like ie: `index.html` and it includes a div with an id 'app', which will
come in handy later. This could be replaced by index.html, or an esj file if you
prefered.

So now we have our `render-react-app` file in our `./server` folder, so lets put
it to use. In our `./server/index.js' file, lets import our new file and add the
middleware to the chain:

```diff
// after other imports
+ import renderReactApp from './render-react-app';

// after other middleware
- app.use(function index(ctx) {
-   ctx.body = 'Hello Friends :)';
- });
+ app.use(renderReactApp);
```

you should now see "Hello this is React speaking to you", which is great but we
actually want to render our app, not just a string. To do this we need to start
thinking in components.

We are going to create our main App component and render that on the server.
Create a new folder called `/app` and a file called `App.js`, this is where we
will define our first component, a simple component that renders a title for our
page.

```js
import React from 'react';

export default function() {
  return (
    <div>
      <h1>Cool guy example app</h1>
    </div>
  );
}
```

Now we can use this component in our middleware within
`server/render-react-app.js`. Head back to the `render-react-app` file and add
the <App/> component in the <HTML> wrapper.

```diff
import React from 'react';
import {renderToString} from 'react-dom/server';
import HTML from '@shopify/react-html';

+ import App from '../app/App';

export default (ctx) => {
  const markup = renderToString(
    <HTML>
-      <div>{title}</div>
+      <App />
    </HTML>
  );

  ctx.body = markup;
}
```

If you view source or use the inspect panel on your browser on your page now you
should see a full HTML document with an `app` div and our App component's
`<h1 />`.

This App component will come to represent the our entire tree of components,
which can be as deep as it needs to be without ever changing this tag.

#### Step 3: React in the Browser

Much like we have a server folder for server code, lets create a client folder
for client code. We should strive to end up with very little code in this folder
as the bulk of our logic should be universal between both the server and client,
living in the `/app` folder.

So, first make a `client` folder and within in an `index.js` file. Like this:
`./client/index.js`.

Next we are going to mount our same React application in the browser, this is
called "hydrating" the DOM.

```js
import React from 'react';
import ReactDOM from 'react-dom';

import App from '../app/App';

console.log('hello from the client');

ReactDOM.hydrate(<App />, document.getElementById('app'));
```

👩🏻‍🏫: Why use hydrate instead of render? ReactDOM.hydrate() is same as render(),
but is used to hydrate(attach event listeners) to a container whose HTML
contents were rendered by ReactDOMServer. React will attempt to attach event
listeners to the existing markup. Using ReactDOM.render() to hydrate a
server-rendered container is deprecated because of slowness.

In our code we are looking for an element with the id `app` and using that
element to as the place to mount our client-side react app.

But where does this element with the `app` id come from? Well, remember the HTML
component we imported from `@shopify/react-html`? It automatically wraps our
contents in a div with an id of `app`. Conviently it will also add our
client-side script to the markup, if we tell it to.

Our client-side script will need to include React, ReactDOM, our app component
and anything else we add in the future.

This middleware will look for a `webpack.config.js` in the project root and that
will tell webpack how to compile our code. For our app, we want to run our `js`
files through the `babel-loader`. We did that earlier in our workshop, but lets
complete our webpack set up now:

(IT NEEDS TO BE LIKE
THIS)(https://github.com/Shopify/unite-react-node-app-workshop/blob/1c405970a0fc19107719963f159b37e5e566b940/webpack.config.js)

Now that this middleware is installed you should see a 'Compiled Successfully'
message in your console. The final step is to tell our `<HTML />` component to
include the compiled script bundle.

This is done with a prop to our the `<HTML />` component called `deferedScripts`
we can add that now. As mentioned earlier, props are pretty standard in React.
They're just inputs on the component.

So head back to `render-react-app` and add the `deferedScripts` prop to our HTML
component like this:

```js
<HTML
  deferedScripts={[{path: 'bundle.js'}]}
>
```

Now if you refresh the browser, you should see a log in our console "Hello from
the client", this is coming from client-side Javascript. 👏
