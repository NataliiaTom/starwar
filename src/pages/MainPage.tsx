import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { CharacterList } from '../components/CharacterList';
import { CharacterGraph } from '../components/CharacterGraph';
import { Character } from '../types';

export const MainPage: React.FC = () => {
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    return (
        <div className="main-container">
            <Typography variant="h4" component="h1" className="main-title">
                Star Wars Character Viewer
            </Typography>
            <div className="content-container">
                <div className="character-list-container">
                    <CharacterList onSelectCharacter={setSelectedCharacter} />
                </div>
                <div className="character-graph-container">
                    <div className="character-graph-content">
                        {selectedCharacter ? (
                            <CharacterGraph character={selectedCharacter} />
                        ) : (
                            <Typography variant="body1">Select a character to view details</Typography>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
