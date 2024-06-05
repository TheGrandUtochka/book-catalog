import { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import {Form, Button, Container, Badge, Alert} from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import './reactTags.css'

const AddBook = () => {
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState([]);
    const [year, setYear] = useState(0);
    const [rating, setRating] = useState(0);
    const [isbn, setIsbn] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleDelete = (i) => {
        setAuthors(authors.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag) => {
        setAuthors([...authors, tag]);
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newAuthors = authors.slice();
        newAuthors.splice(currPos, 1);
        newAuthors.splice(newPos, 0, tag);
        setAuthors(newAuthors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newBook = {
            title,
            authors: authors.map((tag) => tag.text),
            year: year ? parseInt(year) : null,
            isbn,
        };
        if (rating) {
            newBook.rating = parseInt(rating);
        }
        try {
            await addDoc(collection(db, 'books'), newBook);
            setTitle('');
            setAuthors([]);
            setYear(0);
            setRating(0);
            setIsbn('');
            setSuccessMessage('Книга успешно добавлена!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <Container>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formAuthors">
                    <Form.Label>Список авторов</Form.Label>
                    <ReactTags
                        tags={authors}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        handleDrag={handleDrag}
                        inputFieldPosition="bottom"
                        autocomplete
                        tagComponent={(props) => (
                            <Badge pill variant="primary" className="mr-2">
                                {props.tag.text}
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="ml-2 p-0"
                                    onClick={() => props.removeTag(props.index)}
                                >
                                    &times;
                                </Button>
                            </Badge>
                        )}
                    />
                </Form.Group>

                <Form.Group controlId="formYear">
                    <Form.Label>Год публикации</Form.Label>
                    <Form.Control
                        type="number"
                        min="1800"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formRating">
                    <Form.Label>Рейтинг: {rating}</Form.Label>
                    <Form.Control
                        type="range"
                        min="0"
                        max="10"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formIsbn">
                    <Form.Label>ISBN</Form.Label>
                    <Form.Control
                        type="text"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Добавить
                </Button>
            </Form>
        </Container>
    );
};

export default AddBook;