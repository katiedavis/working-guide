# Building our app

Now that we have laid the ground work for our app, lets build a way to run it!
In order to do that, we need to add some scripts to our `package.json` file.

```
 "scripts": {
   "test": "echo \"Error: no test specified\" && exit 1",
   "dev": "nodemon --exec babel-node index.js",
   "start": "yarn run dev"
 },
```

For now, **start** is going to run **dev**, and dev is going to look at
`index.js` in the root for instruction and use _nodemon_ to automatically
restart the node application when file changes in the directory are detected.

---

### Creating our server

Create a `server` folder and inside that an `index.js` file:

ie: `./server/index.js`

Remember that API key and secret we est up in our `.env` file? We're finally
going to use them!

In `./server/index.js`:

```
import dotenv from 'dotenv';

dotenv.config();
```

FYI - config will read your `.env` file, parse the contents, assign it to
process.env,and return an Object with a parsed key containing the loaded content
or an error key if it failed.

Next, we're going to add a packaged called Koa to our project

`yarn add koa`

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

```
import server from './server';

const {PORT = 3000} = process.env;

server.listen(PORT, () => {
 console.log(`🚀 Listening on port ${PORT}`);
});
```

---
