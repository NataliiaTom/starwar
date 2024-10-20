import React, { useState, useEffect, } from 'react';
import { ListItem, ListItemText, } from '@mui/material';
import { fetchCharacters } from '../services/api';
import { Character } from '../types';
import InfiniteScroll from "react-infinite-scroll-component";


interface CharacterListProps {
    onSelectCharacter: (character: Character) => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({ onSelectCharacter }) => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadMoreCharacters = async () => {
        if (!hasMore) return;
        fetchCharacters(page).then(newCharacters => {
            console.log("newCharacters.next:", !newCharacters.next);
            if (!newCharacters.next) {
                setHasMore(false);
            } else {
                setCharacters((prevCharacters) => {
                    let ids = new Set(prevCharacters.map((c: Character) => c.id));
                    return [...prevCharacters, ...newCharacters.results.filter((c: Character) => !ids.has(c.id))];
                });
                setPage((p) => p + 1);
            }
        }).catch(error => console.error("Error fetching characters:", error))
    };

    useEffect(() => {
        loadMoreCharacters();
    }, []);

    return (
        <div id="scrollableDiv" style={{ height: '100%', overflowY: 'auto' }}>
            <InfiniteScroll
                dataLength={characters.length}
                next={loadMoreCharacters}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
            >
                {characters.map((character) => (
                    <ListItem
                        style={{ height: '100px' }}
                        key={character.url}
                        component="button"
                        onClick={() => onSelectCharacter(character)}
                    >
                        <ListItemText primary={character.name} />
                    </ListItem>
                ))}
            </InfiniteScroll>
        </div>
    );
};
