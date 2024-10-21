import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { CharacterList } from './components/CharacterList';
import { Character } from './types';
import { fetchCharacters } from './services/api';
import { MainPage } from './pages/MainPage';
import ReactFlow from "react-flow-renderer";




describe("App", () => {
  it("renders Home page", () => {
    render(<MainPage />);
    expect(screen.getByTestId('heroes-list')).toBeInTheDocument();
  });

  it("API is working", async () => {
    const res = await fetch(`${process.env.REACT_APP_API_KEY}/people/?page=1`);
    const result = await res.json();
    expect(result.results[0].name).toBe('Obi-Wan Kenobi');
  });

})

