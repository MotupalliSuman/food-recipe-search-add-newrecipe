import view from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class ResultsView extends view {
  _parentElement = document.querySelector('.results');
  _errorMessage = ' No recipes foundf for your query! Please try again ;)';
  _message = '';

  _generateMarkup() {
    // console.log(this._data)
    return this._data.map(results=>previewView.render(results,false)).join('');
  }
}

export default new ResultsView();
