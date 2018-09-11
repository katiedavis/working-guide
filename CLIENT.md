## Front end of app

#### Step 1

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

You should see an updated version of your title on your page now.
