import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TeamProvider} from "./context/TeamContext.js";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <TeamProvider>
          <App />
      </TeamProvider>
  </StrictMode>,
)
