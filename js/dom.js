const UNCOMPLETE_BOOK_SHELF_LIST_ID = "incompleteBookshelfList";
const COMPLETE_BOOK_SHELF_LIST_ID = "completeBookshelfList";
const BOOK_ITEMID = "listId";


const checkBox = document.getElementById("inputBookIsComplete");
let isCompleted = false;

checkBox.addEventListener("change", function(){
    if(checkBox.checked){
        isCompleted = true;
        document.querySelector("span").innerText = "Selesai dibaca";
    }else {
        isCompleted = false;
        document.querySelector("span").innerText = "Belum selesai dibaca";
    }
});

function inCompleteBook (title, bookAuthor, bookYear, isCompleted) {
    //membuat elemen judul
    const textTitle = document.createElement("h3");
    textTitle.innerHTML = `<span id="title">` + title + `</span>`;

    //membuat elemen penulis
    const textAuthor = document.createElement("p");
    textAuthor.innerHTML = `Penulis: <span id="author">` + bookAuthor + `</span>`;

    //membuat elemen tahun
    const textYear = document.createElement("p");
    textYear.innerHTML = `Tahun: <span id="year">` + bookYear + `</span>`;
    

    //membuat elemen div
    const div = document.createElement("div");
    div.classList.add("action");

    //membuat elemen article dengan class book_item
    const textContainer = document.createElement("article");
    textContainer.classList.add("book_item");

    textContainer.append(textTitle, textAuthor, textYear);
    
    if(isCompleted){
        div.append(
            createButtonUndo(),
            createRedButton()
        );
    } else {
        div.append(
            createCheckButton(),
            createRedButton()
        );
    }

    textContainer.append(div);

    return textContainer; 
};

function createButtonUndo(){
    return createUndoButton("yellow", function(event){
        undoBookFromComplete(event.target.parentElement.parentElement);
    });
};

function createCheckButton(){
    return createButton("green", function(event){
        addBookToCompleted(event.target.parentElement.parentElement);
        
    });
};

function createRedButton(){
    return createButtonRed("red", function(event){
        removeBookFromIncompleted(event.target.parentElement.parentElement);
    });
}


function createButton(green, eventListener){
    // Membuat button selesai di baca
    const buttonGreen = document.createElement("button");
    buttonGreen.classList.add(green);
    buttonGreen.innerText = "Selesai Dibaca";
    
    buttonGreen.addEventListener("click", function (event) {
        eventListener(event);
    });

    return buttonGreen;
};


function createButtonRed(red, eventListener){
    // Membuat button hapus
    const buttonRed = document.createElement("button");
    buttonRed.classList.add(red);
    buttonRed.innerText = "Hapus";
    
    buttonRed.addEventListener("click", function (event) {
        if(confirm("Anda yakin menghapus item buku ini ?")){
        eventListener(event);
        }
    });

    return buttonRed;
};

function createUndoButton(yellow, eventListener){
    // Membuat button undo selesai di baca
    const buttonYellow = document.createElement("button");
    buttonYellow.classList.add(yellow);
    buttonYellow.innerText = "Belum Selesai";
    
    buttonYellow.addEventListener("click", function (event) {
        eventListener(event);
    });

    return buttonYellow;
};


function addbook() {
    const uncompleteBookList = document.getElementById(UNCOMPLETE_BOOK_SHELF_LIST_ID);
    const completeBookList = document.getElementById(COMPLETE_BOOK_SHELF_LIST_ID);
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;

    const readNow = inCompleteBook(inputBookTitle, inputBookAuthor, inputBookYear, isCompleted);

    const bookObject = composeBookObject(inputBookTitle, inputBookAuthor, inputBookYear, isCompleted);
        readNow[BOOK_ITEMID]=bookObject.id;
        bookshelf.push(bookObject);

        if (isCompleted) {
            completeBookList.append(readNow);
        } else {
            uncompleteBookList.append(readNow);
        }
        updateDataToStorage();
    }



function addBookToCompleted(bookElement){
    const listCompleted = document.getElementById(COMPLETE_BOOK_SHELF_LIST_ID);
    const bookTitle = bookElement.querySelector("span#title").innerHTML;
    const bookAuthor = bookElement.querySelector("span#author").innerHTML;
    const bookYear = bookElement.querySelector("span#year").innerHTML;
    
 
    const newBookDone = inCompleteBook(bookTitle, bookAuthor, bookYear, true);

    const book = findBook(bookElement[BOOK_ITEMID]);
    console.log(book);
    book.isCompleted = true;
    newBookDone[BOOK_ITEMID] = book.id;

    listCompleted.append(newBookDone);
    console.log(listCompleted);
    bookElement.remove();

    updateDataToStorage();

    
    return listCompleted;
};

function removeBookFromIncompleted(bookElement /* HTMLELement */) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    bookshelf.splice(bookPosition, 1);

    bookElement.remove();

    updateDataToStorage();
};

function undoBookFromComplete(bookElement){
    const listBookUncomplete = document.getElementById(UNCOMPLETE_BOOK_SHELF_LIST_ID);
    const bookTitle = bookElement.querySelector("span#title").innerHTML;
    const bookAuthor = bookElement.querySelector("span#author").innerHTML;
    const bookYear = bookElement.querySelector("span#year").innerHTML;
 
    const newBookDone = inCompleteBook(bookTitle, bookAuthor, bookYear, false);

    const book=findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted= false;
    newBookDone[BOOK_ITEMID] = book.id;

    listBookUncomplete.append(newBookDone);
    
    bookElement.remove();

    updateDataToStorage();

    return listBookUncomplete;
};

function refreshDataFromBookShelf() {
    const BookUncompleted = document.getElementById(UNCOMPLETE_BOOK_SHELF_LIST_ID);
    let BookCompleted = document.getElementById(COMPLETE_BOOK_SHELF_LIST_ID);
  
  
    for(book of bookshelf){
        const newBook = inCompleteBook(book.booktitle, book.bookauthor, book.bookyear, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;
  
  
        if(book.isCompleted){
            BookCompleted.append(newBook);
        } else {
            BookUncompleted.append(newBook);
        }
    }
 };


 const searchBook = document.forms['searchBook'].querySelector("input");;
 searchBook.addEventListener("keyup", function(){
    // const cariBuku = e.target.value.toLowerCase();
    let inputTitle = document.getElementById("searchBookTitle").value.toLowerCase();

    const book_shelf = document.getElementsByClassName("book_shelf");
    const book_item = document.getElementsByClassName("book_item");
    // const bookList = document.querySelectorAll(".book_list");

    Array.from(book_item).forEach(function(item){
        const listItem = item.firstElementChild.textContent.toLowerCase();

         if(listItem.indexOf(inputTitle) != -1 ){
             item.style.display ='block';
         }else {
             item.style.display = 'none';
         }
     });

 });