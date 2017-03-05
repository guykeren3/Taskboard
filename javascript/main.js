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
    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          <span class="caret"></span>
        </button>
    <ul class="dropdown-menu">
      <li><a href="#">Delete List</a></li>
    </ul>
  </div>
  <div class="panel-body">
  <ul class="list-container">
  </ul>
  </div>
  <div class="panel-footer"><button class="add-card-button">Add a card</button></div>
`;

// const editCardTemplate = `<div class="modal fade" tabindex="-1" role="dialog">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//         <h4 class="modal-title">Modal title</h4>
//       </div>
//       <div class="modal-body">
//         <p>One fine body&hellip;</p>
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
//         <button type="button" class="btn btn-primary">Save changes</button>
//       </div>
//     </div><!-- /.modal-content -->
//   </div><!-- /.modal-dialog -->
// </div><!-- /.modal -->`;

let addListButton = document.querySelector('#add-list');

function createList(data) {
//catching the main div to push the other divs into it
  const listParent = document.createElement('div');
  listParent.className = 'panel panel-default';
  listParent.innerHTML = listTemplate;
  // console.info(data);
  let divWrapper = document.querySelector('.wrapper');

// parentNode.insertBefore(newNode, referenceNode) example for how to use insertBefore node that been used below;

  divWrapper.insertBefore(listParent, addListButton);

  // Handle clicks on list title
  let newListSpan = listParent.querySelector('.list-title');
// console.info(newListSpan);

  // gets the tasks text
  if (typeof data !== 'undefined') {
    let liName = data.title;
    newListSpan.textContent = liName;   // enteres the object title as the list title
    let liTasksArray = data.tasks;
    // console.info('this is the tasks array', liTasksArray);
    for (const i in liTasksArray) {
      let cardData = liTasksArray[i];
      // console.info(textInListArray);
      let ulInList = listParent.querySelector('.list-container');

      addCard(ulInList, cardData);
    }
  }

  // console.info(newListSpan);
  handleListTitle(newListSpan);


  // Handle list options button
  let listOptions = listParent.querySelector('.dropdown');
  makeButtonSupportRemoveList(listOptions);

  // Handle clicks on Add Card
  let cardButton = listParent.querySelector('.add-card-button');
  cardButton.addEventListener('click', newCardClickHandler);
  // console.log(cardButton);
}
addListButton.addEventListener('click', (e) => {
  createList();
});

function addListenerToButtons() {
  let cardButtonString = document.querySelectorAll('.add-card-button');
  // console.log(cardButtonString);

  for (const button of cardButtonString) {
    button.addEventListener('click', newCardClickHandler);
    // console.info('should see a button', button);
  }
}

function addCard(container, data) {
  let newLi = document.createElement('li');
  newLi.className = 'panel-body';

  if (typeof data !== 'undefined') {
    let membersArray = data.members;
    newLi.textContent = data.text;
    let teamatesInitialContainer = document.createElement('div');
    teamatesInitialContainer.className = 'initials-container-position';

    for (const member of membersArray) {
      // console.info('span with names', member);
      let teamatesInitialsSpan = document.createElement('span');
      teamatesInitialsSpan.className = 'label label-primary initials';
      teamatesInitialsSpan.setAttribute('title', member);
      teamatesInitialContainer.appendChild(teamatesInitialsSpan);

      let membersArrayBySpaces = member.split(' ');
      // console.info(membersArrayBySpaces);
      // from full name takes each name and puts it in the array
      let initials = '';

      for (const name of membersArrayBySpaces) {
        let firstLetter = name.charAt(0);
        // will bring the first letter of each name
        // console.info('firstLetter', firstLetter);
        initials += firstLetter;
        // initials = initials + firstLetter every iteration
      }
      // console.info(initials);
      teamatesInitialsSpan.textContent = initials;
      // console.info('members splits more', membersArrayBySpaces);
      newLi.appendChild(teamatesInitialContainer);
    }
  }
  else {
    // adding an example string.
    newLi.textContent = 'example string just so the li wont be so thin';
  }
  let btnEdit = document.createElement('button');
  btnEdit.className = ('btn btn-info btn-xs edit-card');
  btnEdit.textContent = 'Edit card';

  newLi.appendChild(btnEdit);
  // console.log(newLi);
  container.appendChild(newLi);

  btnEdit.addEventListener('click', (e) => {
    let target = e.target;
    // console.info(target);
    const modal = document.querySelector('.wrapper-edit');
    // console.info('this is the modal', modal);
    let closeModalX = document.querySelector('.modal-header > button > span');

    let closeModalButton = document.querySelector('.modal-footer > button');

    if (modal.style.display === 'none') {
      modal.style.display = 'block';

      closeModalX.addEventListener('click', (event) => {
        let target = event.target;
        if (modal.style.display === 'block') {
          modal.style.display = 'none';
        }
      });
      closeModalButton.addEventListener('click', (event) => {
        let target = event.target;
        if (modal.style.display === 'block') {
          modal.style.display = 'none';
        }
      });
    }
  })
}

function newCardClickHandler(event) {
  const target = event.target;
  let divFooter = target.parentNode;
  // console.log(divFooter);
  let divParent = divFooter.parentNode;
  // console.log(divParent);
  let divUl = divParent.querySelector('.list-container');
  // console.log(divUl);

  addCard(divUl);
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
// console.info(subMenuButtons);

// apply event listener to every arrow button

for (const button of subMenuButtons) {
  // console.info(button);
  // putting display = none on all the button list to initialize it
  makeButtonSupportRemoveList(button)
}

function makeButtonSupportRemoveList(button) {

  let ulInsideButton = button.querySelector('.dropdown-menu');
  // console.info(ulInsideButton);
  ulInsideButton.style.display = 'none';

  button.addEventListener('click', (e) => {
    const button = e.target;
    // console.info(button);
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
    // console.info(divPanelPanelDefault);
    let headerSpan = divPanelPanelDefault.querySelector('.panel-heading > span');
    // console.info(headerSpan);
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

// getting the JSON and parsing it

function reqListener(event) {
  const target = event.target;
  let listObject = JSON.parse(target.responseText);
  // console.info(listObject);
  const boardArray = listObject.board;
  // console.info('this is the board which is inside the json', boardArray);

  for (const list of boardArray) {
    // console.info('loop', list);
    createList(list);
    // let title = listObject[i].title;
    // console.info(title);
  }
}

const oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "assets/board.json");
oReq.send();

// console.info(oReq);

// let listObject = oReq.parse();
//
// console.info(listObject);

// ===============================================

const boardButton = document.querySelector('.board');
const membersButoon = document.querySelector('.members');

// for now will hide the main to work on members ui

membersButoon.addEventListener('click', (e) => {
  let main = document.querySelector('main'); {
    main.style.display = 'none';
  }
});

