# iframe Manager

A [Webflow Designer Extension App](https://developers.webflow.com/data/docs/designer-extensions) that allows for managing and creating custom DOM `<iframe>` elements on a Webflow page in the Designer. This is useful for when you need to manage 3rd party embed products on a page. This app uses the v2 Designer APIs below.

[Designer Extension APIs v2](https://developers.webflow.com/designer/reference/introduction)

This app is built with [SvelteKit](https://kit.svelte.dev/) (Svelte+Vite)

## Try it out

Want to run this extension on your own Webflow site? Follow the steps below for registering a Webflow app on your site.

1. [Register an app](https://developers.webflow.com/data/docs/register-an-app#register-an-app) in your workspace
   - When selecting building blocks, you only need to check **Designer extension (Designer API)**, you won't need **Data client (REST API)** for this example
2. [Install the registered app](https://developers.webflow.com/data/docs/register-an-app#install-an-app) to a Webflow site in your workspace
3. [Follow the local development](#local-development) section below to run the app on your localhost
4. Once you've installed the app onto your site, you should be able to **Launch the development app** in the Designer
   - Ensure the **Development URL** is set to `http://localhost:1337/`
5. Now you can start inserting iframe content, or managing your existing iframe attributes from within the app.

## Local development

Want to run the app locally to try out the app yourself, or maybe experiment with changing the code?

### Prerequisites

- Installed [Git](https://git-scm.com/)
- Installed [Node and npm](https://nodejs.org/en/download/)
- To test on a Webflow site:
  - Create an account on [Webflow](https://webflow.com/) or login
  - Set up a Webflow site on a workspace

### Run the app

1. Inside a terminal/shell, clone (make a copy of) the repository to your local machine and navigate inside it

```
git clone https://github.com/Webflow-Examples/iframe-manager-extension.git

cd iframe-manager-extension
```

2.  Run `npm i` at the root of this project to install dependencies

3.  Run `npm run dev` to start up the Vite build and serve it at `http://localhost:1337` (this port is default)
4.  Now you can open this Designer Extension app in Webflow to test, or you can make code changes
    - Note that if you make code changes to the `.svelte` files, you'll need to "refresh" the Designer Extension within Webflow to see any changes reflect

### Project setup

This project is a small-scale example, but see below to learn more about what logic lives in what files:

- `src/` - Where all the app logic lives
  - `routes/` - Where all pages live, but there's only one page in this app
    - `+page.svelte` - Top level JS + HTML that make up the app UI
    - `CreateModal.svelte` - Component for creating and injecting an iframe into the page
    - `EditAttributesModal.svelte` - Component for editing existing iframe attributes and saving it back to the element on the page
    - `IFrameTypes.d.ts` - Centralized file for some custom Typescript types
    - `styles.css` - Where all the styles live for this app
  - `app.html` - The entry HTML file when the app gets loaded. This loads all the markup in `+page.svelte`
- `package.json` - Lists all dependencies for the app
- `webflow.json` - Configuration for Designer Extension app, including which version of APIs to use, the name of the extension, and the initial size the app should take up on the Designer UI
