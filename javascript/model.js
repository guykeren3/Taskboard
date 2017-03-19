/**
 * Created by Guy on 19/03/2017.
 */

let appData = {
  lists: [],
  members: []
};

function saveToStorage() {
  localStorage.setItem('appData', JSON.stringify(appData));
}

function pullFromStorage() {
  appData = JSON.parse(localStorage.getItem('appData'));
  return appData;
}

function isAllDataReady() {
  if (getListsFromData().length && getMembersFromData().length) {
    saveToStorage();
    return true;
  }
  else {
    return false;
  }
}

function getListsFromData() {
  return appData.lists;
}

function getMembersFromData() {
  return appData.members
}

function updateDataBoard(jsonArray) {
  appData.lists = jsonArray;
  saveToStorage();
}

function updateDataMembers(jsonArray) {
  appData.members = jsonArray;
  saveToStorage();
}

function updateDataWithEmptyList() {
  let listAmount = appData.lists.length;

  const newList = {
    title: `New List ${listAmount}`,
    tasks: []
  };
  appData.lists.push(newList);
  saveToStorage();
}

function addMemberData(member) {
  appData.members.push(member);
  saveToStorage();
}

function removeMemberData(li) {
  //finding the id in members and comparing to the li with the same id to remove when clicking delete.
  appData.members.forEach((member, index) => {
    if (member.id === li.getAttribute('data-member-id')) {
      let memberToRemove = member.id; //saving the id we are removing for later use to remove it from the tasks in lists as well
      appData.members.splice(index, 1);
      // finding the id we removed and comparing to the ids in the task, if same remove that id from the task itself with the index and splice

      appData.lists.forEach((list, indexOfList) => {
        list.tasks.forEach((task, indexOfTask) => {
          task.members.forEach((id, indexOfId) => {
            if (id === memberToRemove) {
              task.members.splice(indexOfId, 1);
            }
          })
        })
      })
    }
  });
  saveToStorage();
}

// localStorage.setItem('appData', JSON.stringify(appData));
//should see that it updates in browser local storage
//should put that line everywhere the appData is updated in the model.
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

  saveToStorage();

  return emptyCard;
}




