import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './Components/Layout';
import { StoreProvider } from './Components/StoreContext';
import AppRoutes from './Routes/AppRoutes';
import './Assets/Css/style.css';

const theme = createTheme({
  palette: {
    primary: { main: '#2f3e34' },
    secondary: { main: '#8d7356' }
  },
  shape: { borderRadius: 10 }
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <StoreProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </StoreProvider>
  </ThemeProvider>
);

export default App;
