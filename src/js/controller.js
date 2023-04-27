import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';

import recipieView from './views/recipieView.js';
import recipeView from './views/recipieView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarksView.js';
import addRecipieView from './views/addRecipieView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipie = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // Updating bookmarks view
    bookmarkView.update(model.state.bookmarks);

    //1) loading recipie
    await model.loadRecipe(id);

    //2) Rendering recipie
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load Search
    await model.loadSearchResult(query);

    //3)Render results
    resultsView.render(model.getSearchResultsPage());

    //Render initial Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipie serving(in state)
  model.updateServings(newServings);
  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //Update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipie = async function (newRecipe) {
  try {
    // SHOW loading spinner
    recipeView.renderSpinner();
    //UPload the new Recipe
    await model.uploadRecipie(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipieView.renderMessage();

    //Render Bookmark View
    bookmarkView.render(model.state.bookmarks);

    //Change id in the url
    window.history.pushState(null, '', `#{${model.state.recipe.id}}`);

    //Close Form window
    setTimeout(function () {
      addRecipieView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipieView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipieView.addHandlerRender(controlRecipie);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipieView.addHandlerUpload(controlAddRecipie);
};

init();
