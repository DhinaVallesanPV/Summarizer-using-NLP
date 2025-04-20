
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import AuthForm from '@/components/AuthForm';
import Home from './Home';

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    document.title = 'PaperScribe - Research Paper Summarizer';
  }, []);

  return isAuthenticated ? <Home /> : <AuthForm />;
};

export default Index;
