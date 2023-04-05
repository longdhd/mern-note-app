import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { Note as NoteModel } from '../models/note';
import * as NotesApi from "../network/notes_api";
import styles from '../styles/NotesPage.module.css';
import styleUtil from '../styles/utils.module.css';
import AddEditNoteDialog from './AddEditNoteDialog';
import Note from './Note';

const NotesPageLoggedInView = () => {
    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
    const [isLoading, setisLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);

    useEffect(() => {
        async function loadNotes() {
            try {
                setLoadingError(false);
                setisLoading(true);
                const notes = await NotesApi.fetchNotes();
                setNotes(notes);
            } catch (err) {
                console.error(err);
                setLoadingError(true);
            } finally {
                setisLoading(false);
            }
        }

        loadNotes();
    }, [])

    const deleteNote = async (note: NoteModel) => {
        try {
            await NotesApi.deleteNote(note._id);
            setNotes(notes.filter(existingNotes => existingNotes._id !== note._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const notesGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
            {notes.map(note => {
                return (
                    <Col key={note._id}>
                        <Note
                            note={note}
                            className={styles.note}
                            onDeleteClicked={deleteNote}
                            onNoteClicked={setNoteToEdit}
                        />
                    </Col>
                )
            })}
        </Row>

    return (
        <>
            <Button
                className={`mb-4 ${styleUtil.blockCenter}`}
                onClick={() => setShowDialog(true)}
            >
                <div style={{
                    display:'flex',
                    gap: 8,
                    alignItems:'center'
                }}>
                    <FaPlus />
                    Add new note
                </div>
            </Button>
            {isLoading && <Spinner animation='border' variant='primary' />}
            {loadingError && <p>Something went wrong ...</p>}
            {!isLoading && !loadingError &&
                <>
                    {notes.length > 0
                        ? notesGrid
                        : <p>You don't have any notes yet</p>}
                </>
            }
            {showDialog &&
                <AddEditNoteDialog
                    onDismiss={() => setShowDialog(false)}
                    onNoteSaved={(newNote) => {
                        setNotes([...notes, newNote]);
                        setShowDialog(false);
                    }}
                />
            }
            {noteToEdit &&
                <AddEditNoteDialog
                    noteToEdit={noteToEdit}
                    onDismiss={() => setNoteToEdit(null)}
                    onNoteSaved={(updateNote) => {
                        setNotes(notes.map(existingNode => existingNode._id === updateNote._id ? updateNote : existingNode));
                        setNoteToEdit(null);
                    }}
                />
            }
        </>
    )
}

export default NotesPageLoggedInView;
