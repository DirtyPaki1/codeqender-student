'use client';

import Image from 'next/image';
import TweetGenerator from './components/TweetGenerator';

export default function Home() {
  return (
    <main className="App">
      <div className='container'>
        <h1>Codebender Tweet Generator</h1>
        <p>Transform your code snippets into engaging tweets!</p>
        <TweetGenerator />
      </div>
    </main>
  )
}
