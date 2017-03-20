/**
 * Created by Guy on 27/02/2017.
 */

/**
 View
 */

/*=====================================================================
 Templates
 //===================================================================*/

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
        <button type="submit" class="btn btn-primary">Add</button>
      </form>
    </li>
  </ul>
</div>`;
const addListTemplate = `<div class="wrapper">
    <button class="btn add-list-btn" id="add-list"> Add a list...</button>
  </div>`;

/*=====================================================================
 Feature related functions
 //===================================================================*/

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

    const span = e.target;
    span.style.display = 'none';
    let text = span.innerHTML;
    const currentList = getListsFromData().find((list) => text === list.title);
    let input = document.createElement("input");
    input.type = "text";
    input.value = span.innerHTML;
    span.parentNode.insertBefore(input, span);
    input.focus();

    input.addEventListener('blur', (e) => {
      const input = e.target;
      let inputText = input.value;
      if (input.value.trim() !== '') {

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


      if (e.keyCode === ENTER) {
        const currentList = getListsFromData().find((list) => titleSpanContent === list.title);
        currentList.title = input.value;
        e.target.blur();
      }
    });
  });
}

function makeButtonSupportRemoveList(button) {

  let ulInsideButton = button.querySelector('.dropdown-menu');

  ulInsideButton.style.display = 'none';

  button.addEventListener('click', (e) => {
    const button = e.target;

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
    let headerSpan = divPanelPanelDefault.querySelector('.panel-heading > span');
    let headerSpanText = headerSpan.textContent;

    //prompt window
    let result = window.confirm(`Deleting ${headerSpanText} list. Are you sure?`);
    if (result === true) {

      //remove the list if user clicked yes ( true )
      divPanelPanelDefault.parentNode.removeChild(divPanelPanelDefault);

      let liTitle = headerSpanText;

      let indexCounter = 0;

      getListsFromData().forEach((list, index) => {
        if (list.title === liTitle) {
          indexCounter = index;
        }
      });
      getListsFromData().splice(indexCounter, 1);
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
  const boardArray = listObject.board;
  updateDataBoard(boardArray);
  // console.info(appData);
  if (isAllDataReady()) {
    intialListByHashtag();
  }
}

function jsonBoardReq() {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", boardReqListener);
  xhr.open("GET", "assets/board-advanced.json");
  xhr.send();
}

// getting the Members and parsing it

function membersReqListener(event) {
  const target = event.target;
  let membersObject = JSON.parse(target.responseText);
  const membersArray = membersObject.members;

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

function createListOfData() {
  for (const list of getListsFromData()) {
    createList(list);
  }
}

function drawBoardScreen() {
  let mainEle = document.querySelector('main');
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

  let mainEle = document.querySelector('main');

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

  for (let member of getMembersFromData()) {
    creatingMemberFromData(membersUl, member)
  }

  let addMemberForm = createMembersDivContainer.querySelector('form.input-members');
  //need to work on event listener here for the input members
  let addMemberButton = createMembersDivContainer.querySelector('.members-page-form button');
  // adding listener on addMemberButton to add members to appData
  let form = addMemberButton.closest('form.input-members');
  let inputMember = form.querySelector('input.input-fix-members');

  addMemberForm.addEventListener('submit', (e) => {
    //creating new member
    let newMember = {
      id: uuid(),
      name: inputMember.value //brings the input value into name
    };

    e.preventDefault();

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

  //giving the editMode function the membersLi as an argument to work only on him (the membersLi is created each time from line 209)
  manageEditMode(membersLi);
}

function createList(list) {
  // console.info('createList', data);
  let addListButton = document.querySelector('#add-list');
//catching the main div to push the other divs into it
  const listParent = document.createElement('div');
  listParent.className = 'panel panel-default';
  listParent.setAttribute('data-id', uuid());
  listParent.innerHTML = getListTemplate(getListsFromData().length);
  // console.info(data);
  let divWrapper = document.querySelector('.wrapper');

// parentNode.insertBefore(newNode, referenceNode) example for how to use insertBefore node that been used below;

  divWrapper.insertBefore(listParent, addListButton);

  // Handle clicks on list title
  let newListSpan = listParent.querySelector('.list-title');
// console.info(newListSpan);

  // gets the tasks text
  if (typeof list !== 'undefined') {
    let liName = list.title;
    newListSpan.textContent = liName;   // enteres the object title as the list title
    let liTasksArray = list.tasks;
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

function addCard(container, task) {
  let newLi = document.createElement('li');
  newLi.className = 'panel-body';

  let membersArrayInTasksAppData = task.members;
  newLi.innerHTML = `<span class="card-text"> ${task.text} </span>`;
  let cardId = task.id;
  newLi.setAttribute('data-id', cardId);
  let teamatesInitialContainer = document.createElement('div');
  teamatesInitialContainer.className = 'initials-container-position';

  for (const memberIdInTasksInAppData of membersArrayInTasksAppData) {

// finding the id in the appData members and connecting it to the member from the board-advanced AKA membersArray in the loop above.

    const currentMember = getMembersFromData().find(memberObject => memberObject.id === memberIdInTasksInAppData);

    let memberNameIdLinked = currentMember.name;

    let teamatesInitialsSpan = document.createElement('span');
    teamatesInitialsSpan.className = 'label label-primary initials';
    teamatesInitialsSpan.setAttribute('title', memberNameIdLinked);
    teamatesInitialContainer.appendChild(teamatesInitialsSpan);

    let membersArrayBySpaces = memberNameIdLinked.split(' ');

    // from full name takes each name and puts it in the array
    let initials = '';

    for (const name of membersArrayBySpaces) {
      let firstLetter = name.charAt(0);
      // will bring the first letter of each name
      initials += firstLetter;
      // initials = initials + firstLetter every iteration
    }
    teamatesInitialsSpan.textContent = initials;
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

    //adding the li id of the editBtn we clicked to the modal to connect the two
    modal.setAttribute('data-id', liParentOfEditId);

    // working on modal checkboxes to be dynamic js and not hard coded:
    // catching the div that wraps the checkboxes
    // creating div's for each member in a loop
    // creating input and label for every member and pushing into the div
    const checkBoxContainer = document.getElementById('members');
    checkBoxContainer.innerHTML = '';

    //find the task
    let currentTask = {};

    getListsFromData().forEach((list, indexOfList) => {
      for (let task of list.tasks) {
        if (task.id === modal.getAttribute('data-id')) {
          //if array is empty no members checked
          currentTask = task;
          //toDo: we found the task we should break the loop
          break;
        }
      }
    });

    //creating the members checkBoxes in the modal

    getMembersFromData().forEach((member, index) => {
      let memberInputContainer = document.createElement('div');
      memberInputContainer.className = 'checkbox';

      let memberInputCheckBoxLabel = document.createElement('label');
      let inputMemberCheckBox = document.createElement('input');
      inputMemberCheckBox.setAttribute('type', 'checkbox');

      inputMemberCheckBox.value = member.id;

      let spanInInput = document.createElement('span');
      spanInInput.textContent = member.name;

      /* comparing the task members and members id in appData, if it exists ( through indexOf check ) check the checkbox, if not, keep going and leave it empty. */

      if (currentTask.members.indexOf(member.id) !== -1) {
        inputMemberCheckBox.checked = true;
      }

      memberInputCheckBoxLabel.appendChild(inputMemberCheckBox);
      memberInputCheckBoxLabel.appendChild(spanInInput);
      memberInputContainer.appendChild(memberInputCheckBoxLabel);
      checkBoxContainer.appendChild(memberInputContainer);
    });

    //catching the text area in the modal
    let cardText = document.getElementById('card-text');


    // catching the titles select container

    let moveToTitlesInModalContainer = document.getElementById('move-to');

    /* emptying the select each time edit button is clicked on the modal because if not, each time the we will click the same lists will be added to the move to. */

    moveToTitlesInModalContainer.innerHTML = '';

    getListsFromData().forEach((list, index) => {
      let moveToTitlesOptions = document.createElement('option');
      moveToTitlesOptions.textContent = list.title;

      /*
       running over the lists in order to run over each list task and            comparing the task id inside to the modal id, if same - entering the      task text to the modal text area.
       */

      list.tasks.forEach((task, index) => {
        if (task.id === modal.getAttribute('data-id')) {
          cardText.value = task.text;
        }
      });

      // pushing the titles options to the select container
      moveToTitlesInModalContainer.appendChild(moveToTitlesOptions);
    });

    //catching the save btn and when clicking updating the card text.

    let saveModalBtn = document.querySelector('.btn-save-modal');
    //getting an array of the spans
    let spanInCard = document.querySelectorAll('span.card-text');

    //save button event listener

    saveModalBtn.addEventListener('click', (e) => {
      //running over the lists and catching the list
      getListsFromData().forEach((list, index) => {
        //running over the lists tasks
        list.tasks.forEach((task, index) => {
          //comparing task id with modal id, if same update
          if (task.id === modal.getAttribute('data-id')) {
            //updating the card itself in appData with the modal changes
            task.text = cardText.value;
            //running over the spans and comparing the id to the modal if same updating the ui of the span.
            spanInCard.forEach((span, index) => {
              //getting the li of each span because the id is on him
              let liParentOfSpan = span.closest('li');
              //comparing the li id to tht modal id, if same update.
              if (liParentOfSpan.getAttribute('data-id') === modal.getAttribute('data-id')) {
                //updating the ui span with the task from the modal.
                span.textContent = task.text;
              }
            });
          }
        });
      });

      //working on replacing the checked names in the cards

      //getting the id's of the inputs that are checked and pushing to a new array

      getListsFromData().forEach((list, indexOfList) => {
        for (let task of list.tasks) {
          if (task.id === modal.getAttribute('data-id')) {
            //if array is empty no members checked
            currentTask = task;
            //toDo: we found the task we should break the loop
            break;
          }
        }
      });

      let membersArrayChecked = [];
      let checkBoxes = document.querySelectorAll('div.checkbox input');

      checkBoxes.forEach((checkBox, indexOfCheckBox) => {
        if (checkBox.checked === true) {
          membersArrayChecked.push(checkBox.value);
        }
      });
      currentTask.members = membersArrayChecked;
      intialListByHashtag();

      if (modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    });

    let deleteModalBtn = document.querySelector('.btn-delete-card');

    deleteModalBtn.addEventListener('click', (e) => {

      //removing the task from the appData
      getListsFromData().forEach((list, index) => {
        list.tasks.forEach((task, indexOfTask) => {
          if (task.id === modal.getAttribute('data-id')) {
            let currentTask = task.id;
            list.tasks.splice(indexOfTask, 1);
          }
        });
      });

      //removing the card from the ui when hitting delete in modal
      liParentOfEdit.remove();

      //closing the modal window
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    });

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

/*=====================================================================
 Initializing app related functions
 //===================================================================*/

function isTabActive() {

  const boardButton = document.querySelector('.board');
  const membersButton = document.querySelector('.members');

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

function manageEditMode(currentLi) {

  // because the function is called elsewhere without an argument gotta do an if for the case of currentLi === undefined

  if (typeof currentLi !== 'undefined') {

    /*before fixing the function (had a bug) caught all the buttons and did loops on them and added event listneres on each. now improved the function by giving it the li that holds all the buttons as an argument, the li is given by an earlier function that creates each list according to the appData. */

    const editButtonMembers = currentLi.querySelector('.align-members-buttons button:not(.save-data)');

    const editButtonMembersSaveData = currentLi.querySelector('.align-members-buttons button.save-data');

    const editButtonMemberDelete = currentLi.querySelector('.align-members-buttons .delete-member');

    editButtonMembers.addEventListener('click', (e) => {
      let target = e.target;
      let spanInLi = currentLi.querySelector('.reset-span');
      let inputMembers = currentLi.querySelector('input');
      inputMembers.value = spanInLi.textContent;
      currentLi.classList.toggle('edit-mode');
      // trying to switch the span with the input when clicking save
      editButtonMembersSaveData.addEventListener('click', (e) => {
        spanInLi.textContent = inputMembers.value;

        for (let member of getMembersFromData()) {
          if (member.id === currentLi.getAttribute('data-member-id')) {
            member.name = spanInLi.textContent;
          }
          currentLi.classList.remove('edit-mode');
        }
      });
    });
    // Add listeners to delete button
    editButtonMemberDelete.addEventListener('click', (e) => {
      // Remove the member from the UI
      currentLi.remove();

      // Remove the member from appData
      removeMemberData(currentLi)
    });
  }
}
window.addEventListener('hashchange', (event) => {
  intialListByHashtag();
});


// check if local storage is not empty
// if not empty check if the appData inside it is not empty as well
// if so, load from appData and call intialByHash function
// if not, load the JSONS as usual

/*=====================================================================
 Local storage
 //===================================================================*/

if (window.localStorage.length !== 0) {
  pullFromStorage();
  intialListByHashtag();
  console.info('Loaded from local storage');
}
else {
  jsonBoardReq();
  jsonMembersReq();
  console.info('Loaded from JSON');
}

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


