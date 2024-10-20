import React, { useState, useEffect, useCallback } from 'react';
import { List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { fetchCharacters } from '../services/api';
import { Character } from '../types';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

interface CharacterListProps {
    onSelectCharacter: (character: Character) => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({ onSelectCharacter }) => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [page, setPage] = useState(1);

    const loadMoreCharacters = useCallback(async () => {
        const newCharacters = await fetchCharacters(page);
        setCharacters((prevCharacters) => [...prevCharacters, ...newCharacters.results]);
        setPage((prevPage) => prevPage + 1);
    }, []);

    const { isFetching, setIsFetching } = useInfiniteScroll(loadMoreCharacters);

    useEffect(() => {
        loadMoreCharacters();
    }, [loadMoreCharacters]);

    return (
        <List>
            {characters.map((character) => (
                <ListItem
                    key={character.id}
                    component="button"
                    onClick={() => onSelectCharacter(character)}
                >
                    <ListItemText primary={character.name} />
                </ListItem>
            ))}
            {isFetching && (
                <ListItem>
                    <CircularProgress />
                </ListItem>
            )}
        </List>
    );
};
