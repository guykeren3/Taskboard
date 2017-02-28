/**
 * Created by Guy on 27/02/2017.
 */

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
  let newListSpan = divHeading.querySelector('#dynamicSpan');
  console.log(newListSpan);

  // event listeners

  newListSpan.addEventListener('click', (e) => {
    const span = e.target;
    span.style.display = 'none';
    let text = span.innerHTML;
    let input = document.createElement("input");
    input.type = "text";
    input.size = Math.max(text.length / 4 * 3, 4);
    span.parentNode.insertBefore(input, span);
    input.focus();
    input.addEventListener('blur', (e) => {

    });

    input.addEventListener('keyup', (e) => {

      // get the input new value, set this value to the span, remove the input, show the span.

      // Remove the input
      const ENTER = 13;
      if (e.keyCode === ENTER) {
        if (input.value.trim() !== '') {
          const input = e.target;
          let inputText = input.value;
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
      }
    });
  });

  let divFooter = document.createElement('div');
  divFooter.className = "panel-footer";
  // divFooter.textContent = 'New List';
  let divBody = document.createElement('div');
  divBody.className = "panel-body";

  let mainUl = document.createElement('ul');
  let li = document.createElement('li');

  let text = document.createTextNode('here we go'); //example text just so something will sit inside the li
  li.appendChild(text);

  mainUl.appendChild(li);

  console.log(mainUl);

  divBody.appendChild(mainUl);
  divParent.appendChild(divHeading);
  divParent.appendChild(divBody);
  divParent.appendChild(divFooter);

  console.log(divParent);

  // adding new  add card button to a new list

  let addCardButton = document.querySelector('.anchor-adjustment');
  divFooter.appendChild(addCardButton);

  //catching the main div to push the other divs into it

  let divWrapper = document.querySelector('.wrapper');
  let listButton = document.querySelector('#add-list');

  // parentNode.insertBefore(newNode, referenceNode) example for how to use insertBefore node that been used below;
  divWrapper.insertBefore(divParent, listButton);
});

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

