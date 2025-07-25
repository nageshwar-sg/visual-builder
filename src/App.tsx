import React from "react";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
  Link as MuiLink,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import VisualBuilder from "./components/VisualBuilder";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const theme = createTheme();

const About: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      About
    </Typography>
    <Typography>This is a placeholder About page.</Typography>
  </Box>
);

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Container maxWidth="lg">
        <Box display="flex" gap={2} mb={2}>
          <MuiLink component={Link} to="/" underline="hover">
            Home
          </MuiLink>
          <MuiLink component={Link} to="/about" underline="hover">
            About
          </MuiLink>
        </Box>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Typography variant="h4" gutterBottom>
                  Visual Builder
                </Typography>
                <VisualBuilder />
              </>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </Container>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
