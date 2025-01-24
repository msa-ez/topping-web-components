forEach: Model
fileName: web-component.js
path: frontend/src
---
import Vue from 'vue';
import Managing from "./components";
import Vuetify from "vuetify/lib";
import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;
require('./GlobalStyle.css');

Vue.use(Managing);
Vue.use(Vuetify);

const axios = require("axios").default;
axios.backend = null; //"http://localhost:8088";
if (axios.backend) axios.backendUrl = new URL(axios.backend);
axios.fixUrl = function(original) {
    if(!axios.backend && original.indexOf("/")==0) {
        return original;
    }

    var url = null;

    try {
        url = new URL(original);
    } catch(e) {
        url = new URL(axios.backend + original);
    }

    if(!axios.backend) return url.pathname;

    url.hostname = axios.backendUrl.hostname;
    url.port = axios.backendUrl.port;

    return url.href;
}

const vuetify = new Vuetify({});

class WebComponentElement extends HTMLElement {
    constructor() {
        super();
        this.vueInstance = null;
    }

    connectedCallback() {
        var slotContent = "";
        const props = {};
        if (this.childNodes.length > 0) {
            this.childNodes.forEach((child) => {
                const componentName = child.nodeName.toLowerCase();
                slotContent += `<${componentName} v-bind="props"></${componentName}>`;
                if (child.attributes) {
                    Array.from(child.attributes).forEach(attr => {
                        try {
                            props[attr.name] = JSON.parse(attr.value);
                        } catch (e) {
                            props[attr.name] = attr.value;
                        }
                    })
                }
            })
        }

        this.vueInstance = new Vue({
            vuetify,
            data() {
                return { props };
            },
            template: `<div>${slotContent}</div>`,
        }).$mount();

        this.innerHTML = '';
        this.appendChild(this.vueInstance.$el);
    }

    disconnectedCallback() {
        if (this.vueInstance) {
            this.vueInstance.$destroy();
        }
    }
}

window.customElements.define('{{options.package}}-app', WebComponentElement);