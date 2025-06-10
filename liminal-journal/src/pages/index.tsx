import React from 'react'
import { TldrawWrapper } from '../components/TldrawWrapper'

export default function Home() {
  return (
    <div className="journal-page flex flex-col h-screen">
      <header className="bg-[var(--primary)] text-white p-4">Liminal Journal</header>
      <div className="flex-grow">
        <TldrawWrapper />
      </div>
      <footer className="bg-gray-100 text-center p-2">© DeepFrame</footer>
    </div>
  )
}
