import React, { useState, useEffect } from 'react';
import ReactFlow, { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { fetchCharacterDetails, fetchFilm, fetchStarship } from '../services/api';
import { Character } from '../types';

interface CharacterGraphProps {
    character: Character;
}


export const CharacterGraph: React.FC<CharacterGraphProps> = ({ character }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGraphData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const characterDetails = await fetchCharacterDetails(character.id);
                const films = await Promise.all(characterDetails.films.map((film: string) => fetchFilm(film)));
                const starships = await Promise.all(characterDetails.starships.map((starship: string) => fetchStarship(starship)));

                const newNodes: Node[] = [
                    {
                        id: 'character',
                        type: 'input',
                        data: { label: characterDetails.name, emoji: '🦸‍♂️' },
                        position: { x: 250, y: 25 },

                    },
                    ...films.map((film, index) => ({
                        id: `film-${index}`,
                        data: { label: film.title, emoji: '🦸‍♂️' },
                        position: { x: 100 + index * 200, y: 150 },
                    })),
                    ...starships.map((starship, index) => ({
                        id: `starship-${index}`,
                        data: { label: starship.name },
                        position: { x: 100 + index * 200, y: 300 },

                    })),
                ];

                const newEdges: Edge[] = [
                    ...films.map((_, index) => ({
                        id: `character-film-${index}`,
                        source: 'character',
                        target: `film-${index}`,
                    })),
                    ...starships.map((_, index) => ({
                        id: `character-starship-${index}`,
                        // source: 'character',
                        source: `film-${index}`,
                        target: `starship-${index}`,
                    })),
                ];

                setNodes(newNodes);
                setEdges(newEdges);
                setError(null);
            } catch (error) {
                console.error("Error loading graph data:", error);
                setError("Failed to load character data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        loadGraphData();
    }, [character]);

    if (isLoading) {
        return <div>Loading character data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {nodes.length > 0 && edges.length > 0 ? (
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    style={{ width: '100%', height: '100%' }}
                />
            ) : (
                <div>No data available for this character.</div>
            )}
        </div>
    );
};
