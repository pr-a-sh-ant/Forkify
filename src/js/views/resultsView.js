import View from './view.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No Recipes Found for your query! Please try again 😁';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
