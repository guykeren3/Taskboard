/**
 * Created by Guy on 27/02/2017.
 */

// initializing new lists and using handleListTitle to change the title names of the old lists.

function initOldLists() {
  let oldListSpans = document.querySelectorAll('.list-title');
  console.log(oldListSpans);

  for (const span of oldListSpans) {
    console.log(span);
    handleListTitle(span);
  }
}


initOldLists();


// creating new list

let listButton = document.getElementById('add-list');

listButton.addEventListener('click', (event) => {

  const target = event.target;

  console.log('I was clicked', target);

  let divParent = document.createElement('div');
  divParent.className = "panel panel-default";
  let divHeading = document.createElement('div');
  divHeading.className = "panel-heading";

  divHeading.innerHTML = '<span id="dynamicSpan">' + 'New List' + '</span>';

  let newListSpan = divHeading.querySelector('#dynamicSpan');  // New lists span
  console.log(newListSpan);

  let divFooter = document.createElement('div');
  divFooter.className = "panel-footer";
  // divFooter.textContent = 'New List';
  let divBody = document.createElement('div');
  divBody.className = "panel-body";

  let mainUl = document.createElement('ul');


  console.log(mainUl);

  divBody.appendChild(mainUl);
  divParent.appendChild(divHeading);
  divParent.appendChild(divBody);
  divParent.appendChild(divFooter);

  console.log(divParent);

  handleListTitle(divHeading);

  // adding new  add card button to a new list

  let addCardButton = document.querySelector('.anchor-adjustment');
  divFooter.appendChild(addCardButton);

  //catching the main div to push the other divs into it

  let divWrapper = document.querySelector('.wrapper');
  let listButton = document.querySelector('#add-list');

  // parentNode.insertBefore(newNode, referenceNode) example for how to use insertBefore node that been used below;
  divWrapper.insertBefore(divParent, listButton);
});

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
        console.log(inputText);
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


// creating a new note

let cardButtonString = document.querySelectorAll('.anchor-adjustment');
console.log(cardButtonString);

for (const button of cardButtonString) {
  button.addEventListener('click', (event) => {
    const target = event.target;
    console.log('i was clicked', target);
    let divFooter = target.parentNode;
    console.log(divFooter);
    let divParent = divFooter.parentNode;
    console.log(divParent);
    let divUl = divParent.querySelector('ul');
    console.log(divUl);
    let newLi = document.createElement('li');
    newLi.textContent = 'example string just so the li wont be so thin'; // adding an example string.
    console.log(newLi);
    divUl.appendChild(newLi);
  });
}

