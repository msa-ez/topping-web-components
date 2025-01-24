## Web Component
Create a reusable custom element and use it wherever you want.

### How to create web components
```
# frontend
npm install
npm run build
npm run start
```
You can now use web components: &lt;component-name&gt;&lt;/component-name&gt;

If you want to rename a web components, modify component-name in the following files.
```
-- package.json
  "scripts": {
    "build": "vue-cli-service build --target wc --name component-name ./src/web-component.js",
  },


-- vue-config.js
  /** ... existing code ... */
  configureWebpack: {
    output: {
      libraryTarget: 'window',
      filename: 'component-name.js',
      libraryExport: 'default',
    },
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
          options.compilerOptions = {
          ...options.compilerOptions,
          isCustomElement: tag => tag === 'component-name',
        };
        return options;
      });
  }
  /** ... existing code ... */


-- src/web-component.js
/** ... existing code ... */
window.customElements.define('component-name', WebComponentElement);
```

After modifying the component name, npm run build and npm run start again.


### How to use web components for other projects

#### 1. Load Web Components from HTML Files
To use Web Components built from other projects or HTML files, load the components through the &lt;script&gt; tag.

- Add the required libraries, such as Vuetify, Vue.js, to the &lt;head&gt; tag.
- Add files of built Web Components within the &lt;body&gt; tag as &lt;script&gt;.

```
<head>
    <!-- Vuetify, Vue.js -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>
</head>
<body>
    <!-- built Web Components file -->
    <script src="http://localhost:8080/component-name.js"></script>
</body>
```

#### 2. Using Web Components

Built Web Components can be used like HTML tags. Below is an example of using Web Components.

```
<component-name>
    <component-name-defined-in-vue-instance></component-name-defined-in-vue-instance>
</component-name>


-- Example of Use
<review-app>
    <review-detail :id="1" :value="`{id: 1, rating: 5, content: "Very Good"}`"></review-detail>
<review-app>

// "review-detail" is a globally registered component in a Vue instance defined as a web components
import ReviewDetail from './components/review-detail'
Vue.component("review-detail", ReviewDetail)
```

- Create a component name that you will actually use inside the web components tag.
- The component name that you want to use must be created in a kebab-case as a component defined in the Vue instance.
- Data can be passed to the props as if the child component is called within the Vue component, and if the type to be passed is JSON object, string it and deliver it.