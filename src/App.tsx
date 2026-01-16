import { MainScreen } from './components/MainScreen'
import { ParameterEditor } from './components/ParameterEditor'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MainScreen />
          </div>
          <div>
            <ParameterEditor />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
