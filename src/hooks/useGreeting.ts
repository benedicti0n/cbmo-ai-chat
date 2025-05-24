import { useUser } from "@clerk/nextjs";

export function useGreeting() {
  const { user } = useUser();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = 'Hello';
    
    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 17) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
    
    return greeting;
  };
  
  const getUserName = () => {
    if (!user) return '';
    return user.firstName || '';
  };
  
  const getFullGreeting = () => {
    const greeting = getGreeting();
    const name = getUserName();
    
    if (name) {
      return `${greeting}, ${name}!`;
    }
    return `${greeting}!`;
  };
  
  return {
    greeting: getGreeting(),
    userName: getUserName(),
    fullGreeting: getFullGreeting()
  };
}
