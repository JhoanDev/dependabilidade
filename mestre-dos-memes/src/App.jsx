import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [meme, setMeme] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Banco de dados de memes engraçados
  const memesDatabase = [
    {
      image: "https://i.imgflip.com/1bij.jpg",
      topText: "Quando o código funciona",
      bottomText: "Na primeira tentativa"
    },
    {
      image: "https://i.imgflip.com/9ehk.jpg",
      topText: "Meu deploy",
      bottomText: "Na sexta-feira 18:01"
    },
    {
      image: "https://i.imgflip.com/1g8my4.jpg",
      topText: "Quando vejo um bug",
      bottomText: "Mas decido ignorar"
    },
    {
      image: "https://i.imgflip.com/1h7in3.jpg",
      topText: "Meu café",
      bottomText: "Meu código"
    }
  ]

  const generateRandomMeme = () => {
    setLoading(true)
    const randomIndex = Math.floor(Math.random() * memesDatabase.length)
    setMeme(memesDatabase[randomIndex])
    setLoading(false)
  }

  useEffect(() => {
    generateRandomMeme()
  }, [])

  return (
    <div className="app">
      <h1>🎭 Mestre dos Memes 🎭</h1>
      <p>Aperte o botão para gerar um meme aleatório!</p>
      
      <button onClick={generateRandomMeme} disabled={loading}>
        {loading ? 'Carregando...' : 'Gerar Meme Engraçado'}
      </button>
      
      {meme && !loading && (
        <div className="meme-container">
          <img src={meme.image} alt="Meme engraçado" className="meme-image" />
          <div className="meme-text top">{meme.topText}</div>
          <div className="meme-text bottom">{meme.bottomText}</div>
        </div>
      )}
      
      <div className="footer">
        <p>Feito com React + Vite | 😂 Risos garantidos ou seu dinheiro de volta!</p>
      </div>
    </div>
  )
}

export default App