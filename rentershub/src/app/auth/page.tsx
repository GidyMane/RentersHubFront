import AuthForm from '@/components/AuthForm';
import { Home } from 'lucide-react';

const AuthPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2ba808] rounded-full mb-4">
          <Home className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">RentersHub</h1>
        <p className="text-gray-600 text-sm sm:text-base">Where Smart Kenyans Come to Find Homes</p>
      </div>
      <AuthForm />
      <footer className="mt-8 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} RentersHub. All rights reserved.</p>
        <div className="mt-2 space-x-2">
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
