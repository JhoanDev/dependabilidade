import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [hearts, setHearts] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showFlowers, setShowFlowers] = useState(false)

  // Efeito para os corações flutuantes
  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        left: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 2
      }
      setHearts(prev => [...prev, newHeart])
      
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id))
      }, newHeart.duration * 1000)
    }, 300)

    return () => clearInterval(interval)
  }, [])

  // Mostrar flores depois de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFlowers(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-pink-50 to-soft-pink'} flex flex-col items-center justify-center p-4 overflow-hidden relative`}>
      
      {/* Botão de tema escuro/claro */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-pink-200 text-pink-700'}`}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Corações flutuantes */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute text-love-red opacity-70 animate-float"
          style={{
            left: `${heart.left}%`,
            top: '-20px',
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`
          }}
        >
          ❤
        </div>
      ))}

      {/* Flores que aparecem depois */}
      {showFlowers && (
        <>
          <div className="absolute left-10 bottom-10 text-4xl animate-bounce-slow delay-100">🌼</div>
          <div className="absolute right-10 top-20 text-5xl animate-spin-slow delay-300">🌹</div>
          <div className="absolute right-1/4 top-1/3 text-3xl animate-bounce delay-500">🌸</div>
          <div className="absolute left-1/3 bottom-1/4 text-6xl animate-pulse delay-700">💐</div>
        </>
      )}

      {/* Conteúdo principal */}
      <div className={`${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} bg-opacity-90 rounded-xl shadow-2xl p-8 max-w-2xl text-center z-10 transform transition-all hover:scale-[1.02] duration-500 border-2 ${isDarkMode ? 'border-yellow-300' : 'border-pink-300'}`}>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className={isDarkMode ? 'text-yellow-300' : 'text-pink-700'}>Para Maria Iraci Fernandes</span>
        </h1>
        
        <div className="text-xl md:text-2xl mb-8 leading-relaxed">
          <p className="mb-4">Mãe, em cada passo da minha vida, você esteve ao meu lado.</p>
          
          <p className="mb-4">Quando eu caía, você me levantava. Quando eu duvidava, você acreditava por nós dois. Quando eu não via caminho, você era minha luz.</p>
          
          <p className="text-3xl font-semibold my-6 text-love-red animate-pulse">
            "Sua força é minha inspiração,<br />
            seu amor é meu porto seguro."
          </p>
          
          <p>Obrigado por ser minha base, minha conselheira e minha melhor amiga.</p>
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          <div className="text-4xl animate-bounce">❤️</div>
          <div className="text-4xl animate-bounce delay-100">✨</div>
          <div className="text-4xl animate-bounce delay-200">❤️</div>
        </div>
        
        <p className={`text-lg ${isDarkMode ? 'text-yellow-200' : 'text-pink-600'}`}>
          Com todo amor do seu filho,<br />
          <span className="font-bold">Jhoan Fernandes de Oliveira</span>
        </p>
      </div>
    </div>
  )
}

export default App