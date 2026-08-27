import { NavigationProvider } from './context/NavigationContext';
import { AppShell } from './components/layout/AppShell';

export default function App() {
  return (
    <NavigationProvider>
      <AppShell />
    </NavigationProvider>
  );
}
