import React from "react";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import VisualBuilder from "./components/VisualBuilder";

const theme = createTheme();

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Visual Builder
      </Typography>
      <VisualBuilder />
    </Container>
  </ThemeProvider>
);

export default App;
