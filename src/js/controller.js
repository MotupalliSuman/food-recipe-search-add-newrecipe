import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipe = async function () {
  
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // loading recipe
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    // rendering recipe
    recipeView.render(model.state.recipe);

   
   
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function(){
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return ;


    await model.loadSearchResults(query);
 
    // console.log(model.state.search.results);

    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage(1))


    paginationView.render(model.state.search);

  } catch (err){
    console.error(err)
  };
};

const controlPagination =function(goToPage){
  
  resultsView.render(model.getSearchResultsPage(goToPage))


    paginationView.render(model.state.search);
}


const controlServings =function(newServings){
  model.updatServings(newServings)

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}

const controlAddBookmark =function(){

  if (!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
  }
  else  {
    model.deleteBookmark(model.state.recipe.id);
  }
  // model.addBookmark(model.state.recipe);


  recipeView.render(model.state.recipe);

  bookmarksView.render(model.state.bookmarks)

}

const controlBookmarks=function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe =async function(newRecipe){
  // console.log(newRecipe)
  try{
    addRecipeView.renderSpinner();
   await  model.uploadRecipe(newRecipe);
   console.log(model.state.recipe);

   recipeView.render(model.state.recipe);
   addRecipeView.renderMessage();

   bookmarksView.render(model.state.bookmarks);

   window.history.pushState(null,'',`#${model.state.recipe.id}`);


   setTimeout(function() {

    addRecipeView.toggleWindow();
   },MODEL_CLOSE_SEC*1000);
  } catch (err){
    console.error('***',err);
    addRecipeView.renderError(err.message)
  }
  
}



const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandleUpdateServings(controlServings);
  recipeView.addHanlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  
  // resultsView.addHandlerRender(resultsView)
};

init();
