import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {collection, deleteDoc, doc, onSnapshot} from 'firebase/firestore';

const BookList = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'books'), (querySnapshot) => {
            const booksArray = [];
            querySnapshot.forEach((doc) => {
                booksArray.push({ id: doc.id, ...doc.data() });
            });
            console.log('Книги обновлены:', booksArray); // Добавлен лог для отладки
            setBooks(booksArray);
        }, (error) => {
            console.error("Ошибка получения обновления книг: ", error);
        });

        return () => unsubscribe(); // Функция очистки подписки
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'books', id));
            setBooks(books.filter(book => book.id !== id));
        } catch (error) {
            console.error("Ошибка удаления позиции: ", error);
        }
    };

    const groupBooksByYear = (books) => {
        const grouped = books.reduce((acc, book) => {
            const year = book.year || 'Без года';
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(book);
            return acc;
        }, {});

        return Object.entries(grouped).sort(([yearA], [yearB]) => yearB - yearA);
    };

    const sortedBooks = groupBooksByYear(books);

    return (
        <div>
            {sortedBooks.length > 0 ? (
                sortedBooks.map(([year, books]) => (
                    <div key={year}>
                        <h2>{year}</h2>
                        <ul>
                            {books.sort((a, b) => a.title.localeCompare(b.title)).map((book) => (
                                <li key={book.id}>
                                    <strong>{book.title}</strong> - {book.authors.join(", ")}<br />
                                    Рейтинг: {book.rating || '-'}<br />
                                    ISBN: {book.isbn || '-'}<br />
                                    <button onClick={() => handleDelete(book.id)}>Удалить</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>Нет доступных книг.</p>
            )}
        </div>
    );
};

export default BookList;