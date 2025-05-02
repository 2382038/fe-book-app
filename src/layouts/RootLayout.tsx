import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout