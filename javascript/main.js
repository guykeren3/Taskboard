/**
 * Created by Guy on 27/02/2017.
 */

// initializing new lists and using handleListTitle to change the title names of the old lists.

function initOldLists() {
  let oldListSpans = document.querySelectorAll('.list-title');
  // console.log(oldListSpans);

  for (const span of oldListSpans) {
    // console.log(span);
    handleListTitle(span);
  }
  addListenerToButtons();
}

initOldLists();

// creating new list

const listTemplate = `
  <div class="panel-heading"> <span class="list-title"> New List </span> </div>
  <div class="dropdown">
    <div class="arrow-down"></div>
    <ul class="dropdown-menu">
      <li><span>Delete List</span></li>
    </ul>
  </div>
  <div class="panel-body">
  <ul class="list-container">
  </ul>
  </div>
  <div class="panel-footer"><button class="add-card-button">Add a card</button></div>
`;

let addListButton = document.querySelector('#add-list');

function createList() {
//catching the main div to push the other divs into it
  const listParent = document.createElement('div');
  listParent.className = 'panel panel-default';
  listParent.innerHTML = listTemplate;

  let divWrapper = document.querySelector('.wrapper');

// parentNode.insertBefore(newNode, referenceNode) example for how to use insertBefore node that been used below;

  divWrapper.insertBefore(listParent, addListButton);

  // Handle clicks on list title
  let newListSpan = listParent.querySelector('.list-title');
  // console.info(newListSpan);
  handleListTitle(newListSpan);

  // Handle list options button
  let listOptions = listParent.querySelector('.dropdown');
  makeButtonSupportRemoveList(listOptions);

  // Handle clicks on Add Card
  let cardButton = listParent.querySelector('.add-card-button');
  cardButton.addEventListener('click', newCard);
  // console.log(cardButton);
}

addListButton.addEventListener('click', (e) => {
  createList();
});

function addListenerToButtons() {
  let cardButtonString = document.querySelectorAll('.add-card-button');
  // console.log(cardButtonString);

  for (const button of cardButtonString) {
    button.addEventListener('click', newCard);
    // console.info('should see a button', button);
  }
}


function newCard(event) {
  const target = event.target;
  let divFooter = target.parentNode;
  // console.log(divFooter);
  let divParent = divFooter.parentNode;
  // console.log(divParent);
  let divUl = divParent.querySelector('.list-container');
  // console.log(divUl);
  let newLi = document.createElement('li');
  newLi.textContent = 'example string just so the li wont be so thin'; // adding an example string.
  // console.log(newLi);
  divUl.appendChild(newLi);
}

// event listeners on title function

function handleListTitle(titleElm) {
  titleElm.addEventListener('click', (e) => {
    const span = e.target;
    span.style.display = 'none';
    let text = span.innerHTML;
    let input = document.createElement("input");
    input.type = "text";
    input.value = span.innerHTML;
    input.size = Math.max(text.length / 4 * 3, 4);
    span.parentNode.insertBefore(input, span);
    input.focus();

    input.addEventListener('blur', (e) => {
      const input = e.target;
      let inputText = input.value;
      if (input.value.trim() !== '') {
        // console.log(inputText);
        // const divHeading = input.parentNode;
        // let updateSpan = divHeading.querySelector('span');

        // Update the span
        span.innerHTML = input.value;
        input.parentNode.removeChild(input);

        // Show the e again
        span.style.display = "";
      }
      else {
        input.parentNode.removeChild(input);
        span.style.display = "";
      }
    });

    input.addEventListener('keydown', (e) => {

      // get the input new value, set this value to the span, remove the input, show the span.

      // Remove the input
      const ENTER = 13;
      const input = e.target;
      let inputText = input.value;
      if (e.keyCode === ENTER) {
        e.target.blur();
      }
    });
  });
}

// delete section


// catch all the arrow buttons (divs)

let subMenuButtons = document.querySelectorAll('.dropdown');
console.info(subMenuButtons);

// apply event listener to every arrow button

for (const button of subMenuButtons) {
  // console.info(button);
  // putting display = none on all the button list to initialize it
  makeButtonSupportRemoveList(button)
}

function makeButtonSupportRemoveList(button) {

  let ulInsideButton = button.querySelector('.dropdown-menu');
  console.info(ulInsideButton);
  ulInsideButton.style.display = 'none';

  button.addEventListener('click', (e) => {
    const button = e.target;
    console.info(button);
// clicking on the arrow button turns the display ul to = block
    if (ulInsideButton.style.display === 'none') {
      ulInsideButton.style.display = 'block';
    }
    else {
      ulInsideButton.style.display = 'none';
    }
  });

  let liInsideUlOfButtons = ulInsideButton.querySelector('li');
  liInsideUlOfButtons.addEventListener('click', (e) => {
    const li = e.target;
    let divPanelPanelDefault = li.closest('.panel.panel-default');
    console.info(divPanelPanelDefault);
    let headerSpan = divPanelPanelDefault.querySelector('.panel-heading > span');
    console.info(headerSpan);
    let headerSpanText = headerSpan.textContent;
    // let divHeader = divPanelPanelDefault.querySelector('span');
    // console.info(divHeader);
    let result = window.confirm(`Deleting ${headerSpanText} list. Are you sure?`);
    if (result === true) {
      divPanelPanelDefault.parentNode.removeChild(divPanelPanelDefault);
    }
    else {
      ulInsideButton.style.display = 'none';
    }
  })
}

