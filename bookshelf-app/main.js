// DOM Elements
const bookForm = document.getElementById('bookForm');
const searchForm = document.getElementById('searchBook');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

// State
let books = [];
let editingBookId = null;

// Local Storage
const STORAGE_KEY = 'BOOKSHELF_APP';

// Load books from localStorage
function loadBooks() {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    if (storedBooks) {
        books = JSON.parse(storedBooks);
        renderBooks();
    }
}

// Save books to localStorage
function saveBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    renderBooks();
}

// Create book element
function createBookElement(book) {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book-item');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');

    const title = document.createElement('h3');
    title.textContent = book.title;
    title.setAttribute('data-testid', 'bookItemTitle');

    const author = document.createElement('p');
    author.textContent = `Penulis: ${book.author}`;
    author.setAttribute('data-testid', 'bookItemAuthor');

    const year = document.createElement('p');
    year.textContent = `Tahun: ${book.year}`;
    year.setAttribute('data-testid', 'bookItemYear');

    const actions = document.createElement('div');
    actions.classList.add('book-actions');

    const toggleButton = document.createElement('button');
    toggleButton.textContent = book.isComplete ? 'Undo' : 'Selesai dibaca';
    toggleButton.classList.add('btn-complete');
    toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    toggleButton.onclick = () => toggleBookStatus(book.id);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus buku';
    deleteButton.classList.add('btn-delete');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.onclick = () => deleteBook(book.id);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit buku';
    editButton.classList.add('btn-edit');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.onclick = () => editBook(book);

    actions.append(toggleButton, deleteButton, editButton);
    bookItem.append(title, author, year, actions);

    return bookItem;
}

// Render books
function renderBooks(filteredBooks = books) {
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    filteredBooks.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    });
}

// Add new book
function addBook(event) {
    event.preventDefault();

    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const book = {
        id: editingBookId || new Date().getTime(),
        title,
        author,
        year,
        isComplete
    };

    if (editingBookId) {
        const index = books.findIndex(b => b.id === editingBookId);
        books[index] = book;
        editingBookId = null;
    } else {
        books.push(book);
    }

    saveBooks();
    bookForm.reset();
    updateSubmitButton();
}

// Delete book
function deleteBook(bookId) {
    const confirmDelete = confirm('Apakah Anda yakin ingin menghapus buku ini?');
    if (confirmDelete) {
        books = books.filter(book => book.id !== bookId);
        saveBooks();
    }
}

// Toggle book status
function toggleBookStatus(bookId) {
    const book = books.find(book => book.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooks();
    }
}

// Edit book
function editBook(book) {
    editingBookId = book.id;
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;
    updateSubmitButton();
}

// Update submit button text
function updateSubmitButton() {
    const submitButton = document.querySelector('#bookForm button[type="submit"]');
    const submitSpan = submitButton.querySelector('span') || submitButton;
    submitSpan.textContent = editingBookId ? 'Edit Buku' : 'Masukkan Buku ke rak';
}

// Search books
function searchBooks(event) {
    event.preventDefault();
    const query = document.getElementById('searchBookTitle').value.toLowerCase();
    
    // Filter books based on the title
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(query)
    );
    
    if (filteredBooks.length === 0) {
        // If no books are found, show an alert
        alert("Buku tidak ditemukan.");
    }
    
    // Render the filtered books or all if none is found
    renderBooks(filteredBooks.length > 0 ? filteredBooks : books);
}

// Event listeners
bookForm.addEventListener('submit', addBook);
searchForm.addEventListener('submit', searchBooks);

// Initialize
loadBooks();
updateSubmitButton();