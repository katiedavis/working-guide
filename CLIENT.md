## Front end of app

### Step 1

Now that we are building out our client side, lets talk about our component
Library, [Polaris](https://polaris.shopify.com/).

We mentioned earlier that Polaris is a React component library, but it is also a
design system. It has it all. You do not _have_ to use React to use Polaris, but
it's a super easy way to build an app that is accessible, performant and
responsive, plus, embedded apps look better within the Shopify frame when they
use Polaris because it's our design system!

We can add Polaris to our project via yarn:

```bash
yarn add @shopify/polaris
```

Now, if we were creating an app with a standard index.html file, we could add
our CDN to the head of our document and be done with it. For more info see
[Polaris on Github](https://github.com/Shopify/polaris#usage).

We're going to use webpack to auto import our css instead! Fun. First, lets add
the packages that support autoloading imports:

```bash
yarn add css-loader style-loader
```

Then lets head back to our `webpack.config` file and add this.

```diff
module: {
   rules: [
     {
       test: /\.(js|jsx)$/,
       exclude: /node_modules/,
       use: ['babel-loader'],
     },
+   {
+     test: /\.css$/,
+     use: [{loader: 'style-loader'}, {loader: 'css-loader'}],
+   },
   ],
 },
```

You might want to kil your server and then run `yarn start` again at this point.
Keep `ngrok` running though or you wil lose your URL and you'll have to update
it in the partners dashboard again!

#### Lets test our CSS

Lets go back to our `App.js` component. The one with our title and make sure our
styles are loading.

We need to import the styles themselve (just once!) and then the named component
we're using. Let use `TextStyle`

```diff
import React from 'react';
+ import '@shopify/polaris/styles.css';
+ import {TextStyle} from '@shopify/polaris/styles.css';

export default function() {
  return (
    <div>
-  <h1>Cool guy example app</h1>
+  <TextStyle>Cool guy example app</TextStyle>
    </div>
  );
}
```

This actually won't work though, and if you open your browser console you'll see
an error because you have not used `AppProvider`.

The `AppProvider` component is required at the top level of your app when using
Polaris. It should wrap all the other components in your tree. Lets add it to
our `app.js` file.

```diff
import React from 'react';
+ import '@shopify/polaris/styles.css';
- import {TextStyle} from '@shopify/polaris/styles.css';
+ import {AppProvider, TextStyle} from '@shopify/polaris';

export default function() {
  return (
-    <div>
+    <AppProvider>
-      <h1>Cool guy example app</h1>
+      <TextStyle>Cool guy example app</TextStyle>
-    </div>
+    </AppProvider>
  );
}
```

You should see an updated version of your title on your page now.

---

### Step 2 - App Bridge/Embedded components

Now that Polaris is available to us, we can use it's _embedded components_. We
use a library called `app-bridge` with embedded apps to help the app communicate
properly with it's parent (embedded apps are in an Iframe) and to provide a
streamlined experience for our merchants. The
[app-bridge](https://github.com/Shopify/app-bridge) library does not depend on
any external libraries and can be implimented with vanilla Javascript.

(SHOULD WE DEMO IT OR JUST POINT TO DOCS)

Because we're using `Polaris` we have access to `app-bridge` via it's
components. The `AppProvider` actually takes two props, and with some magic on
our end, it initalizes `app-bridge`. Lets add those now:

The AppProvider takes our `API_KEY` and the `SHOP_ORIGIN` props. We can use our
`API_KEY` from our `.env` file, but getting the `SHOP_ORIGIN` key can be a bit
more tricky.

Lets get our variables:

#### Step 1

Head back to our `render-react-app.js` file. It should look like this:

```js
import React from 'react';
import { renderToString } from 'react-dom/server'; //do we talk about this elsewhere?
import HTML from '@shopify/react-html';

import App from '../app/App';

export default ctx => {
  const markup = renderToString(
    <HTML>
      <App />
    </HTML>
  );

  ctx.body = markup;
};
```

In our `server.js` file, we have access to both the `API_KEY` - it's stored in
our `.dotenv` file and the merchants `SHOP_ORIGIN` - it's returned upon
authentication. They're both stored in our session, which is great...but how do
we use them in our React component?

Our HTML component can take a `prop` called `data` that we can pass that stuff
in!

```diff
import React from 'react';
import { renderToString } from 'react-dom/server'; //do we talk about this elsewhere?
import HTML from '@shopify/react-html';

import App from '../app/App';

export default ctx => {
+  const data = {
+   apiKey: config.apiKey,
+   shopOrigin: ctx.session.shop,
+  };
  const markup = renderToString(
+    <HTML data={data}>
      <App />
    </HTML>
  );

  ctx.body = markup;
};
```

So, we're getting our the `apiKey` variable from our config set up in our
`.dotenv` file, and we are getting the shopOrigin from the `koa-session`.

In order to ue this data, that's passed in via the HTML to our App on the client
side, we need to seralize it. We have a package for that,
[@shopify/react-serialize](https://github.com/Shopify/quilt/tree/master/packages/react-serialize).
Lets add it now:

```bash
yarn add @shopify/react-serialize
```

We can now get our seralized data in our `App.js` file and add it to our
AppProvider like this:

```diff
import React from 'react';
import '@shopify/polaris/styles.css';
import {AppProvider, TextStyle} from '@shopify/polaris';
+ import {getSerialized} from '@shopify/react-serialize';

export default function() {
  return (
   <AppProvider
+    apiKey={getSerialized('apiKey').data}
+   shopOrigin={`https://${getSerialized('shopOrigin').data}`}
    >
     <TextStyle>Cool guy example app</TextStyle>
   </AppProvider>
  );
}
```

Polaris does some work on it's end, and it now knows that our app is an embedded
app!

(NEED TO ADD A LOT MORE HERE)

---
