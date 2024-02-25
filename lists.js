import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, get, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://to-do-list-6850c-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const listItemsInDB = ref(database, "listItems")
const listItemsEl = document.getElementById("list-items");

const numItemsEl = document.getElementById("numItems")
let selectedItemID = null;


const listNameInputFieldEl = document.getElementById("list-name");

const addListButtonEl = document.getElementById("add-list")


addListButtonEl.addEventListener("click", function() {
    let inputValue = listNameInputFieldEl.value

    if(inputValue.length > 0 && inputValue.length <= 15) {
        push(listItemsInDB, inputValue)
   
    } else if (inputValue.length > 15) {
        alert("Maximum of 15 characters only!")
    } else {
        alert("Input Required!");
    }

    clearlistNameInputField();
    
})

onValue(listItemsInDB, function(snapshot) {

    if (snapshot.exists()) {
        let listItemsArray = Object.entries(snapshot.val())
        
        clearItemListsEl()
    
        for(let i = 0; i < listItemsArray.length; i++) {
            let currentItem = listItemsArray[i]
            let currentItemID = listItemsArray[0]
            let currentItemValue = listItemsArray[1]
            appendlistItemsEl(currentItem)

            let totalItems = listItemsArray.length
            numItemsEl.innerHTML = `Items: ${totalItems}`
        }
    } else {
            numItemsEl.innerHTML = `Items: 0`
            listItemsEl.innerHTML = "Currently task-free... for now."
            listItemsEl.style.textAlign = "center";
            listItemsEl.style.fontSize = "18px";
    }

})

function clearlistNameInputField() {
    listNameInputFieldEl.value = ""
}

function appendlistItemsEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    // Create new elements
    let newEl = document.createElement("li");
    let newDivEl = document.createElement("div");

    let deleteButtonEl = document.createElement("button");
    let pencilButtonEl = document.createElement("button");
    let deleteImgEl = document.createElement("img");
    let pencilImgEl = document.createElement("img");

    // Set text content for the li element
    newEl.textContent = itemValue;



    // Set classes and attributes for the buttons
    deleteButtonEl.className = "delete-btn";
    pencilButtonEl.className = "pencil-btn";
    pencilButtonEl.type = "button";
    pencilButtonEl.setAttribute("data-bs-toggle", "modal");
    pencilButtonEl.setAttribute("data-bs-target", "#editDeleteItemModal");

    // Set alt text and source for the images
    deleteImgEl.className = "img-delete";
    deleteImgEl.src = "./images/delete.png";
    pencilImgEl.className = "img-pencil";
    pencilImgEl.src = "./images/pencil.png";

    // Append images to buttons
    deleteButtonEl.appendChild(deleteImgEl);
    pencilButtonEl.appendChild(pencilImgEl);

    // Append buttons to div
    newDivEl.appendChild(deleteButtonEl);
    newDivEl.appendChild(pencilButtonEl);

    // Append div to li
    newEl.appendChild(newDivEl);

    // Add event listener to delete button
    deleteButtonEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `listItems/${itemID}`);

        remove(exactLocationOfItemInDB);
    });

    
    pencilButtonEl.addEventListener("click", function(){
        let inputElement = document.getElementById("edit-list-name");
    inputElement.value = itemValue;

    // Store the ID of the selected item
    selectedItemID = itemID;

 
    })
    


   let isTrue = true
    newEl.addEventListener("click", function() {
        console.log("clicked!")
        console.log(itemID)
        isTrue = !isTrue;
        newEl.className = (isTrue ? 'clicked' : 'unclicked'); 
   
    })

    // Append li to listItemsEl
    listItemsEl.appendChild(newEl);


}

let editBtnEl = document.getElementById("edit-list") 

editBtnEl.addEventListener("click", function() {
     // Retrieve the new value from the input field
     let newValue = document.getElementById("edit-list-name").value;
    if (selectedItemID) {
       
        if (newValue.length > 1 && newValue.length <= 15) {
                // Update the value of the selected item in the database
                console.log (newValue.length)
            let exactLocationOfItemInDB = ref(database, `listItems/${selectedItemID}`);
            set(exactLocationOfItemInDB, newValue);
                        // Reset the selectedItemID after editing
        selectedItemID = null;
        } else if (newValue.length > 15) {
            alert("Maximum of 15 characters only!");
        } else {
            alert("Input Required!");
            console.log (newValue.length)
        }
    }
});

function clearItemListsEl() {
      listItemsEl.innerHTML = "";
}

