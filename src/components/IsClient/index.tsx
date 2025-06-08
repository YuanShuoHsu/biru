import { useEffect, useState } from "react";

interface IsClientProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const IsClient = ({ children, fallback = null }: IsClientProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <>{isClient ? children : fallback}</>;
};

export default IsClient;
