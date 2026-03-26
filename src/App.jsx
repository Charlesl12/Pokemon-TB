import SearchBar from './components/SearchBar/SearchBar';
import TeamSlots from './components/TeamSlots/TeamSlots';
import './App.css';

export default function App() {
  return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Pokémon Team Builder</h1>
          <p className="app-subtitle">Build your team and analyze its strengths and weaknesses</p>
        </header>

        <main className="app-main">
          <div className="search-section">
            <SearchBar />
          </div>
          <TeamSlots />
        </main>
      </div>
  );
}
