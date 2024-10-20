import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const loadMoreCharacters = useCallback(async () => {
        if (!hasMore) return;
        const newCharacters = await fetchCharacters(page);
        if (!newCharacters.next) {
            setHasMore(false);
        } else {
            setCharacters((prevCharacters) => {
                let ids = new Set(prevCharacters.map((c: Character) => c.id));
                return [...prevCharacters, ...newCharacters.results.filter((c: Character) => !ids.has(c.id))];
            });
            setPage((prevPage) => prevPage + 1);
        }
    }, [page, hasMore]);

    const { isFetching, setIsFetching } = useInfiniteScroll(loadMoreCharacters, containerRef);

    useEffect(() => {
        loadMoreCharacters().then(() => setIsFetching(false));
    }, [loadMoreCharacters, setIsFetching]);

    return (
        <div ref={containerRef} style={{ height: '100%', overflowY: 'auto' }}>
            <List>
                {characters.map((character) => (
                    <ListItem
                        key={character.url}
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
        </div>
    );
};
