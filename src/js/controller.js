import * as model from './model.js';
import recipieView from './views/recipieView.js';
import recipeView from './views/recipieView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipie = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();
    //1) loading recipie
    await model.loadRecipe(id);

    //2) Rendering recipie
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const init = function () {
  recipieView.addHandlerRender(controlRecipie);
};

init();
