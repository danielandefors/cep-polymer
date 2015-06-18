#  Sample CEP Extension with Polymer

The purpose of this repo is to test if we can use [Polymer](https://github.com/Polymer/polymer) to develop CEP extensions for Adobe. I.e., we want to know how well (or if) Polymer works when deployed inside the embedded Chromium browser component that Adobe uses to host CEP extensions.

- Run `gulp deploy` to deploy
- Or `gulp watch` to automatically redeploy on change

## Potential Issues

- It looks like the paper-ripple effect doesn't work quite as expected. When you click on the checkbox the ripple animation is square instead of circular.
- Also, when you scroll the paper-header-panel the header doesn't stay on top.

