import { useState } from 'react'
import './App.css'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Cabeçalho Simples */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Minimal App
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-10 max-w-2xl">

        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Recursos</h3>
          <ul className="space-y-3">
            {['Modo Claro/Escuro', 'Responsivo', 'Sem Dependências', 'Fácil de Modificar'].map((item, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-2 text-indigo-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Contato</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1">Mensagem</label>
              <textarea
                id="message"
                rows="4"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
                placeholder="Digite sua mensagem..."
              ></textarea>
            </div>
            <button
              type="button"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Enviar
            </button>
          </form>
        </section>
      </main>

      {/* Rodapé Minimalista */}
      <footer className={`py-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>© {new Date().getFullYear()} Minimal App. Todos os direitos reservados. @jhoandev</p>
      </footer>
    </div>
  )
}