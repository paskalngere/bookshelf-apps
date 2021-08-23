const STORAGE_KEY = "bookshelf_apps";
let bookshelf = [];


//fungsi untuk memeriksa apakah web browser mendukung storage atau tidak
function isStorageExist() /* boolean */ {
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
 };

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
 function saveData() {
    const parsed = JSON.stringify(bookshelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
 }

 /**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see bookshelf}
 */
 function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    
    let data = JSON.parse(serializedData);
    
    if(data !== null)
    bookshelf = data;
  
    document.dispatchEvent(new Event("ondataloaded"));
 }

 function updateDataToStorage() {
    if(isStorageExist())
        saveData();
 }

 function composeBookObject(booktitle, bookauthor, bookyear, isCompleted) {
    return {
        id: +new Date(),
        booktitle,
        bookauthor,
        bookyear,
        isCompleted
    };
 }

 function findBook(bookId) {
    for(book of bookshelf){
        if(book.id === bookId)
            return book;
    }
    return null;
 }

 function findBookIndex(bookId) {
    let index = 0
    for (book of bookshelf) {
        if(book.id === bookId)
            return index;
  
        index++;
    }
  
    return -1;
 }


 