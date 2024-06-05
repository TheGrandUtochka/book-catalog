import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase.js';
import ModalAddBook from '/src/components/ModalAddBook/ModalAddBook.jsx';
import AddBook from '/src/components/AddBook/AddBook.jsx';
import BookList from '/src/components/BookList.jsx';
import { Button, Alert } from 'react-bootstrap';

const App = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [books, setBooks] = useState([]);
    const [recommendedBook, setRecommendedBook] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'books'), (snapshot) => {
            const booksArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBooks(booksArray);
            recommendBook(booksArray);
        });

        // Очистка подписки при размонтировании компонента
        return () => unsubscribe();
    }, []);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const recommendBook = (books) => {
        const currentYear = new Date().getFullYear();
        const filteredBooks = books.filter(book => book.year && (currentYear - book.year >= 3));
        if (filteredBooks.length === 0) {
            setRecommendedBook(null);
            return;
        }

        const maxRating = Math.max(...filteredBooks.map(book => book.rating || 0));
        const bestBooks = filteredBooks.filter(book => book.rating === maxRating);

        const randomBook = bestBooks[Math.floor(Math.random() * bestBooks.length)];
        setRecommendedBook(randomBook);
    };

    return (
        <div>
            <h1>Каталог книг</h1>
            <Button variant="primary" onClick={openModal}>Добавить книгу</Button>
            {recommendedBook && (
                <Alert variant="success" className="mt-3">
                    Рекомендуемая книга: {recommendedBook.title} - {recommendedBook.authors.join(', ')}
                </Alert>
            )}
            <ModalAddBook isOpen={isModalOpen} onClose={closeModal}>
                <AddBook onClose={closeModal} />
            </ModalAddBook>
            <BookList books={books} />
        </div>
    );
};

export default App;