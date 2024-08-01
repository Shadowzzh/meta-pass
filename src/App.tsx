import { useState } from 'react';

import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { cn } from '@/utils/cn';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={cn('h-screen w-screen')}>
      <AuroraBackground>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>

        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      </AuroraBackground>
    </div>
  );
}

export default App;
