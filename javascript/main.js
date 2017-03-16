/**
 * Created by Guy on 27/02/2017.
 */

/**
 Model
 */
const appData = {
  lists: [],
  members: []
};

function updateDataBoard(jsonArray) {
  appData.lists = jsonArray;
}

function updateDataMembers(jsonArray) {
  appData.members = jsonArray;
}

function updateDataWithEmptyList() {
  let listAmount = appData.lists.length;

  const newList = {
    title: `New List ${listAmount}`,
    tasks: []
  };
  appData.lists.push(newList);
}


function addMemberData(member) {
  appData.members.push(member);
}

function removeMemberData(li) {
  appData.members.forEach((member, index) => {
    if (member.id === li.getAttribute('data-member-id')) {
      appData.members.splice(index, 1);
    }
  });
}

/**
 *
 * @param myData
 * @param title
 * @returns {{members: Array, text: string, id: *}}
 */
function addEmptyCardToData(myData, title) {

  // running find on the appData to compare between my title and the appData title and then pushing the card into the correct list in appData.

  const currentList = myData.lists.find((list) => title === list.title);

  const emptyCard = {
    members: [],
    text: 'Add new task',
    id: uuid()
  };

  // console.info(emptyCard);
  currentList.tasks.push(emptyCard);

  return emptyCard;
}


/**
 View
 */

function newCardClickHandler(event) {
  const target = event.target;
  // console.info(target);
  let divFooter = target.parentNode;
  // console.log(divFooter);
  let divParent = divFooter.parentNode;
  // console.log(divParent);
  let divUl = divParent.querySelector('.list-container');
  // console.log(divUl);

  // finding the title of the current list i clicked add button
  let divParentOfLi = target.closest('.panel.panel-default');
  let liTitle = divParentOfLi.querySelector('span.list-title').textContent;

  const emptyCard = addEmptyCardToData(appData, liTitle);
  addCard(divUl, emptyCard);
}

// event listeners on title function

function handleListTitle(titleElm) {
  titleElm.addEventListener('click', (e) => {

    // console.info(appData.lists);
    const span = e.target;
    span.style.display = 'none';
    let text = span.innerHTML;
    const currentList = appData.lists.find((list) => text === list.title);
    // let currentListTitle = currentList.title;
    // console.info(currentListTitle);
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
        currentList.title = input.value;
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
      let inputParent = input.closest('.panel-heading');
      let titleSpanContent = inputParent.querySelector('span.list-title').textContent;
      // console.info(titleSpanContent);
      // console.info(appData.lists);

      if (e.keyCode === ENTER) {
        const currentList = appData.lists.find((list) => titleSpanContent === list.title);
        currentList.title = input.value;
        e.target.blur();
      }
    });
  });
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
      // console.info(appData.lists);

      let liTitle = headerSpanText;
      //

      let indexCounter = 0;

      appData.lists.forEach((list, index) => {
        if (list.title === liTitle) {
          indexCounter = index;
        }
      });
      appData.lists.splice(indexCounter, 1);
    }
    else {
      ulInsideButton.style.display = 'none';
    }
  })
}

// getting the JSON and parsing it

function boardReqListener(event) {
  const target = event.target;
  let listObject = JSON.parse(target.responseText);
  // console.info(listObject);
  const boardArray = listObject.board;
  // console.info('this is the board which is inside the json', boardArray);
  updateDataBoard(boardArray);
  // console.info(appData);
  if (isAllDataReady()) {
    intialListByHashtag();
  }
}

function jsonBoardReq() {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", boardReqListener);
  xhr.open("GET", "assets/board.json");
  xhr.send();
}

// getting the Members and parsing it

function membersReqListener(event) {
  const target = event.target;
  let membersObject = JSON.parse(target.responseText);
  // console.info(membersObject);
  const membersArray = membersObject.members;
  // console.info('this is the board which is inside the json', boardArray);

  // update appData
  updateDataMembers(membersArray);

  if (isAllDataReady()) {
    intialListByHashtag();
  }
}

function jsonMembersReq() {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", membersReqListener);
  xhr.open("GET", "assets/members.json");
  xhr.send();
}

function isAllDataReady() {
  if (appData.lists.length && appData.members.length) {
    return true;
  }
  else {
    return false;
  }
}

function createListOfData() {
  for (const list of appData.lists) {
    // console.info('loop', list);
    createList(list);
    // let title = listObject[i].title;
    // console.info(title);
  }
}

function drawBoardScreen() {
  mainEle.innerHTML = addListTemplate;
  let addListButton = document.querySelector('#add-list');

  addListButton.addEventListener('click', (e) => {
      createList();
      updateDataWithEmptyList()
    }
  )
}

function drawMembersScreen() {
  createMembers();
}

function createMembers() {
  let membersDiv = document.createElement('div');
  membersDiv.className = 'list-group col-sm-8 members-fix';
  membersDiv.innerHTML = membersTemplateWrapper;
  let membersUl = membersDiv.querySelector('div.members-fix ul.members-list');

  //creating a div to push the add new member input into the ul.
  let createMembersLiContainer = document.createElement('li');
  createMembersLiContainer.style.listStyle = 'none';
  let createMembersDivContainer = document.createElement('div');
  createMembersDivContainer.innerHTML = membersTemplateAddMember;
  createMembersLiContainer.appendChild(createMembersDivContainer);
  membersUl.appendChild(createMembersLiContainer);

  for (let member of appData.members) {
    creatingMemberFromData(membersUl, member)
  }


  //need to work on event listener here for the input members
  let addMemberButton = createMembersDivContainer.querySelector('.members-page-form button');
  // adding listener on addMemberButton to add members to appData
  let form = addMemberButton.closest('form.input-members');
  let inputMember = form.querySelector('input.input-fix-members');

  addMemberButton.addEventListener('click', (e) => {
    //creating new member
    let newMember = {
      id: uuid(),
      name: inputMember.value //brings the input value into name
    };

    //reseting the input value after adding a new member
    inputMember.value = '';

    //adding the member to the appData members section
    addMemberData(newMember);
    creatingMemberFromData(membersUl, newMember);
  });

  mainEle.innerHTML = '';
  mainEle.appendChild(membersDiv);
}

function creatingMemberFromData(listParent, member) {
  let memberName = member.name;
  let membersLi = document.createElement('li');
  membersLi.className = 'list-group-item';
  membersLi.setAttribute('data-member-id', member.id);

  membersLi.innerHTML = membersTemplate;
  let spanInLiMembers = document.createElement('span');
  spanInLiMembers.className = 'reset-span';
  spanInLiMembers.textContent = memberName;
  membersLi.appendChild(spanInLiMembers);

  //catching the input parent and inserting the other li's beforehand

  let inputMember = listParent.querySelector('input.input-fix-members');
  let inputLiContainer = inputMember.closest('ul.members-list > li');
  listParent.appendChild(membersLi);
  listParent.insertBefore(membersLi, inputLiContainer);
  manageEditMode();
}

function createList(data) {
  // console.info('createList', data);
  let addListButton = document.querySelector('#add-list');
//catching the main div to push the other divs into it
  const listParent = document.createElement('div');
  listParent.className = 'panel panel-default';
  listParent.setAttribute('data-id', uuid());
  listParent.innerHTML = getListTemplate(appData.lists.length);
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

function getListTemplate(listNum) {
  return `
  <div class="panel-heading"> <span class="list-title">New List ${listNum}</span> </div>
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
}

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

  let membersArray = data.members;
  newLi.textContent = data.text;
  let cardId = data.id;
  newLi.setAttribute('data-id', cardId);
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


  let btnEdit = document.createElement('button');
  btnEdit.className = ('btn btn-info btn-xs edit-card');
  btnEdit.textContent = 'Edit card';

  newLi.appendChild(btnEdit);
  // console.log(newLi);
  container.appendChild(newLi);

  btnEdit.addEventListener('click', (e) => {
    let target = e.target;

    //fetching the card related to the btnEdit we clicked
    let liParentOfEdit = target.closest('li');

    //getting the id attribute from the li of the edit card button
    let liParentOfEditId = liParentOfEdit.getAttribute('data-id');


    const modal = document.querySelector('.wrapper-edit');

    // working on modal checkboxes to be dynamic js and not hard coded:
    // catching the div that wrapps the checkboxes
    // creating div's for each member in a loop
    // creating input and label for every member and pushing into the div
    const checkBoxContainer = document.getElementById('members');
    checkBoxContainer.innerHTML = '';
    appData.members.forEach((member, index) => {
      let memberInputContainer = document.createElement('div');
      memberInputContainer.className = 'checkbox';
      let memberInputLabel = document.createElement('label');
      let inputMember = document.createElement('input');
      inputMember.setAttribute('type', 'checkbox');
      inputMember.value = member.name;
      let spanInInput = document.createElement('span');
      spanInInput.textContent = member.name;
      memberInputLabel.appendChild(inputMember);
      memberInputLabel.appendChild(spanInInput);
      memberInputContainer.appendChild(memberInputLabel);
      checkBoxContainer.appendChild(memberInputContainer);
    });



    //adding the li id of the editBtn we clicked to the modal to connect the two
    modal.setAttribute('data-id', liParentOfEditId);

    //catching the text area in the modal
    let cardText = document.getElementById('card-text');

    /*
     running over the lists in order to run over each list task and            comparing the task id inside to the modal id, if same - entering the      task text to the modal text area.
     */

    appData.lists.forEach((list, index) => {
      list.tasks.forEach((task, index) => {
        if (task.id === modal.getAttribute('data-id')) {
          cardText.value = task.text;
        }
      });
    });

    // updating the members according to appData


    if (modal.style.display === 'none') {
      modal.style.display = 'block';

      let closeModalX = document.querySelector('.modal-header > button > span');

      closeModalX.addEventListener('click', (event) => {
        let target = event.target;
        if (modal.style.display === 'block') {
          modal.style.display = 'none';
        }
      });

      let closeModalButton = document.querySelector('.modal-footer > button');

      closeModalButton.addEventListener('click', (event) => {
        let target = event.target;
        if (modal.style.display === 'block') {
          modal.style.display = 'none';
        }
      });
    }
  })
}

// catch all the arrow buttons (divs)

let subMenuButtons = document.querySelectorAll('.dropdown');
// console.info(subMenuButtons);

// apply event listener to every arrow button

for (const button of subMenuButtons) {
  // console.info(button);
  // putting display = none on all the button list to initialize it
  makeButtonSupportRemoveList(button)
}

// ===============================================
const membersTemplateWrapper = `
  <span class="members-header">Taskboard Members</span>
  <ul class="list-group col-sm-8 members-list">`;

const membersTemplate = `<form class="members-page-form normal-mode">
        <input type="text" class="form-control edit-input" placeholder="Current">
      </form>
      <div class="align-members-buttons">
        <button type="button"
                class="btn btn-info btn-sm none-edit">Edit
        </button>
        <button type="button" class="btn btn-danger btn-sm none-edit delete-member">Delete</button>
        <button type="button" class="btn btn-default btn-sm edit-buttons">Cancel</button>
        <button type="button" class="btn btn-success btn-sm edit-buttons save-data">Save</button>
      </div>
    </li>`;
const membersTemplateAddMember = `<li class="list-group-item">
      <form class="members-page-form input-members">
        <input type="text" class="form-control input-fix-members" placeholder="Add new member">
        <button type="button" class="btn btn-primary">Add</button>
      </form>
    </li>
  </ul>
</div>`;

const boardButton = document.querySelector('.board');
const membersButton = document.querySelector('.members');

const addListTemplate = `<div class="wrapper">
    <button class="btn add-list-btn" id="add-list"> Add a list...</button>
  </div>`;

let mainEle = document.querySelector('main');

function isTabActive() {
  let hashWindow = window.location.hash;
  if (hashWindow.includes('board')) {
    boardButton.classList.add('active');
    membersButton.classList.remove('active');
  }
  if (hashWindow.includes('members')) {
    boardButton.classList.remove('active');
    membersButton.classList.add('active');
  }
}

function intialListByHashtag() {
  let hashWindow = window.location.hash;

  if (hashWindow !== '') {
    if (hashWindow.includes('board')) {
      drawBoardScreen();
      createListOfData();
      isTabActive();
    }
    if (hashWindow.includes('members')) {
      drawMembersScreen();
      manageEditMode();
      isTabActive();
    }
  }
  else {
    window.location.hash = '#board';
  }
}

function manageEditMode() {
  const editButtonMembers = document.querySelectorAll('.align-members-buttons button:not(.save-data)');

  const editButtonMembersSaveData = document.querySelectorAll('.align-members-buttons button.save-data');

  const editButtonMemberDelete = document.querySelectorAll('.align-members-buttons button.delete-member');

  for (const btn of editButtonMembers) {
    btn.addEventListener('click', (e) => {
      let target = e.target;
      let liParent = target.closest('li');
      let spanInLi = liParent.querySelector('.reset-span');
      let inputMembers = liParent.querySelector('input');
      inputMembers.value = spanInLi.textContent;
      liParent.classList.toggle('edit-mode');
      // console.info(target);
      // console.info(liParent);
      // trying to switch the span with the input when clicking save

      for (const btnSave of editButtonMembersSaveData) {
        btnSave.addEventListener('click', (e) => {
          spanInLi.textContent = inputMembers.value;

          for (let member of appData.members) {
            // console.info(member);
            if (member.id === liParent.getAttribute('data-member-id')) {
              member.name = spanInLi.textContent;
            }
          }
          liParent.classList.remove('edit-mode');
        })
      }
    })
  }

  // Add listeners to all delete buttons
  editButtonMemberDelete.forEach((btnDelete, index) => {
    btnDelete.addEventListener('click', (e) => {
      let liParent = e.target.closest('li');
      let liUlContainer = liParent.parentNode;

      // Remove the member from the UI
      liUlContainer.removeChild(liParent);

      // Remove the member from appData
      removeMemberData(liParent)
    });
  })
}
window.addEventListener('hashchange', (event) => {
  intialListByHashtag();
});

jsonBoardReq();
jsonMembersReq();


// Polys

// find Poly
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function (predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}


