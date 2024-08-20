import { initializeApp } from "firebase/app"
import { getDatabase, ref, push, onValue, remove, set, DatabaseReference } from "firebase/database"


type AppSetting = {
    databaseURL: string
}

// Firebase Link
const appSettings: AppSetting = {
    databaseURL: "https://to-do-list-6850c-default-rtdb.firebaseio.com/"
}

// Database initialization and connection
const app = initializeApp(appSettings)
const database = getDatabase(app)
const listItemsInDB: DatabaseReference = ref(database, "listItems")

// Variable declaration and initialization

const listItemsEl: HTMLUListElement | null = document.getElementById("list-items") as HTMLUListElement | null;
const numItemsEl: HTMLParagraphElement | null = document.getElementById("numItems") as HTMLParagraphElement | null;
let selectedItemID: string | null = null;
const backBtn: HTMLImageElement = document.getElementById("back-btn") as HTMLImageElement;
const listNameInputFieldEl: HTMLInputElement = document.getElementById("list-name") as HTMLInputElement;
const addListButtonEl: HTMLButtonElement = document.getElementById("add-list") as HTMLButtonElement;
let isTrue: boolean = true;
const editBtnEl: HTMLButtonElement = document.getElementById("edit-list") as HTMLButtonElement;
const inputElement: HTMLInputElement | null = document.getElementById("edit-list-name") as HTMLInputElement | null;


// Event listener for adding a task
addListButtonEl.addEventListener("click", function(event: MouseEvent): void {
    let inputValue: string = listNameInputFieldEl.value

    if(inputValue.length > 0 && inputValue.length <= 15) {
        push(listItemsInDB, inputValue)
   
    } else if (inputValue.length > 15) {
        alert("Maximum of 15 characters only!")
    } else {
        alert("Input required!");
    }

    clearlistNameInputField();
    
})




// Function for rendering the list whenever there are changes
onValue(listItemsInDB, function(snapshot) {

    if (snapshot.exists()) {
        const listItemsArray: [string, any][] = Object.entries(snapshot.val() || {})
        clearItemListsEl()
    
        for(let i = 0; i < listItemsArray.length; i++) {
            let currentItem = listItemsArray[i]
            appendlistItemsEl(currentItem)
          

            let totalItems = listItemsArray.length
            if (numItemsEl) { // Ensure numItemsEl is not null
                numItemsEl.innerHTML = `Items: ${totalItems}`
            }
            
        }
    } else {

            if(numItemsEl){
                 numItemsEl.innerHTML = `Items: 0`
            }

            if(listItemsEl){
                listItemsEl.innerHTML = "Currently task-free... for now."
                listItemsEl.style.textAlign = "center";
                listItemsEl.style.fontSize = "18px";
            }
            
    }

})

// Function to clear input field
function clearlistNameInputField(): void {
    listNameInputFieldEl.value = ""
}

// Function that render the list
function appendlistItemsEl(item: [string, any]) {

    let itemID: string = item[0]
    let itemValue: string = item[1]

    // Create new elements
    let newEl: HTMLLIElement = document.createElement("li");
    let newDivEl: HTMLDivElement = document.createElement("div");
    let deleteButtonEl: HTMLButtonElement = document.createElement("button");
    let pencilButtonEl: HTMLButtonElement = document.createElement("button");
    let deleteImgEl: HTMLImageElement = document.createElement("img");
    let pencilImgEl: HTMLImageElement = document.createElement("img");

    // Set text content for the li element
    newEl.textContent = itemValue;

    // Set classes and attributes for the buttons
    deleteButtonEl.className = "delete-btn";
    pencilButtonEl.className = "pencil-btn";
    pencilButtonEl.type = "button";
    pencilButtonEl.setAttribute("data-bs-toggle", "modal");
    pencilButtonEl.setAttribute("data-bs-target", "#editDeleteItemModal");

    // Set source for the images
    deleteImgEl.className = "img-delete";
    deleteImgEl.src = "./delete.png";
    pencilImgEl.className = "img-pencil";
    pencilImgEl.src = "./pencil.png";

    // Append images to buttons
    deleteButtonEl.appendChild(deleteImgEl);
    pencilButtonEl.appendChild(pencilImgEl);

    // Append buttons to div
    newDivEl.appendChild(deleteButtonEl);
    newDivEl.appendChild(pencilButtonEl);

    // Append div to li
    newEl.appendChild(newDivEl);

    // Add event listener to delete button
    deleteButtonEl.addEventListener("click", function(event: MouseEvent) {
        let exactLocationOfItemInDB: DatabaseReference = ref(database, `listItems/${itemID}`);

        remove(exactLocationOfItemInDB);
    });


    // Add event listener to edit button
    pencilButtonEl.addEventListener("click", function(event: MouseEvent){
        let inputElement: HTMLInputElement = document.getElementById("edit-list-name")as HTMLInputElement;
        inputElement.value = itemValue;

    // Store the ID of the selected item
        selectedItemID = itemID; 
    })

    
    // Add event listener to a task to strike out text and change background
    newEl.addEventListener("click", function(event: MouseEvent) {
        
        newEl.className = (isTrue ? 'clicked' : 'unclicked'); 
        isTrue = !isTrue;
   
    })

    // Append li to listItemsEl
    if(listItemsEl) {
        listItemsEl.appendChild(newEl);
    }
    
}


// Add event listener to edit button
editBtnEl.addEventListener("click", function() {
     
     if (inputElement) {
        const newValue: string = inputElement.value;
 
     
     console.log(selectedItemID)
        if (selectedItemID) {
        
            if (newValue.length > 1 && newValue.length <= 15) {
                // Update the value of the selected item in the database
                let exactLocationOfItemInDB = ref(database, `listItems/${selectedItemID}`);
                set(exactLocationOfItemInDB, newValue);
                            
                // Reset the selectedItemID after editing
                selectedItemID = null;
            } else if (newValue.length > 15) {
                alert("Maximum of 15 characters only!");
            } else {
                alert("Input required!");
            }
        }
    }
});

inputElement?.addEventListener("keypress", (event: KeyboardEvent) => {
    const newValue: string = inputElement.value;
 
    if (selectedItemID) {
        
        if (newValue.length > 1 && newValue.length <= 15) {
            // Update the value of the selected item in the database
            let exactLocationOfItemInDB = ref(database, `listItems/${selectedItemID}`);
            set(exactLocationOfItemInDB, newValue);
                        
            // Reset the selectedItemID after editing
            selectedItemID = null;
        } else if (newValue.length > 15) {
            alert("Maximum of 15 characters only!");
        } else {
            alert("Input required!");
        }
    }
  });


// Function to clear list
function clearItemListsEl(): void {
    if(listItemsEl){
        listItemsEl.innerHTML = "";
    }
      
}



// Add event to go back to landing page
backBtn.addEventListener("click", function(event: MouseEvent) {
    location.href="./index.html"
})