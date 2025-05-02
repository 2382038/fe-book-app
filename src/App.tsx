import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Books from './pages/Books';
import Reviews from './pages/Reviews';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import { AuthProvider } from './utils/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* Protected routes */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<PrivateRoute><Books /></PrivateRoute>} />
        <Route path="books" element={<PrivateRoute><Books /></PrivateRoute>} />
        <Route path="books/:bookId/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
        <Route path="reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
        <Route path="favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;


// const router = createBrowserRouter(createRoutesFromElements(
//   <Route>	

//       <Route path="/" element={<BaseLayout/>}>
//         <Route path="register" element={<PublicRoute><Register/></PublicRoute>}></Route>
//         <Route path="Signin" element={<PublicRoute><Signin/></PublicRoute>}></Route>
//       </Route>

//       <Route path="/" element={<RootLayout/>}>
//         <Route path="/note/:id" element={<PrivateRoute><Notelist/></PrivateRoute>}></Route>
//         <Route path="note/edit/:id" element={<PrivateRoute><NoteEdit/></PrivateRoute>}></Route>
//         <Route path="notes/add/:folderId" element={<PrivateRoute><NoteAdd/></PrivateRoute>}></Route>
//         <Route path="folder" element={<PrivateRoute><FolderList/></PrivateRoute>}></Route>
//         <Route path="folders/add" element={<PrivateRoute><AddFolderPage/></PrivateRoute>}></Route>
//         <Route path="user" element={<PrivateRoute><Users/></PrivateRoute>}></Route>
//         <Route path="note/view/:noteId" element={<PrivateRoute><NoteView/></PrivateRoute>}></Route>

//       </Route>

//       <Route path="/" element={<BaseLayout/>}>
//         <Route index element={<Home/>}></Route>
//       </Route>
      
//   </Route>
// ));
// return (
//   <>
//     <AuthProvider>
//       <QueryClientProvider client={queryClient}>
//         <RouterProvider router={router} />
//       </QueryClientProvider>
//     </AuthProvider>
//   </>
// )