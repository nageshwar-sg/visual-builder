import React, { useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
  Link as MuiLink,
  Divider,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Preview from "./components/Preview";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { deliveryStack, language } from "./utils/contentstack";
import VisualBuilder from "./components/VisualBuilder";

const theme = createTheme();

interface Block {
  id: string;
  type: "text" | "image";
  content: string;
}

const About: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      About
    </Typography>
    <Typography>This is a placeholder About page.</Typography>
  </Box>
);

const PreviewPage: React.FC = () => {
  const [blocks, setBlocks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchPublished() {
      setLoading(true);
      setError(null);
      try {
        const result = await deliveryStack
          .ContentType("page")
          .Query()
          .language(language)
          .toJSON()
          .find();
        const entries = result[0] || [];
        if (entries.length > 0) {
          setBlocks(entries[0].blocks || []);
        } else {
          setBlocks([]);
        }
      } catch (e) {
        setError("Failed to fetch published content");
      } finally {
        setLoading(false);
      }
    }
    fetchPublished();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Public Preview
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Preview blocks={blocks} />
      )}
    </Box>
  );
};

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  return (
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
            <MuiLink component={Link} to="/preview" underline="hover">
              Preview
            </MuiLink>
          </Box>
          <Routes>
            <Route
              path="/"
              element={
                <Box display="flex" gap={4} alignItems="flex-start">
                  <Box flex={1} minWidth={0}>
                    <Typography variant="h4" gutterBottom>
                      Visual Builder
                    </Typography>
                    <VisualBuilder blocks={blocks} setBlocks={setBlocks} />
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                  <Box
                    flex={1}
                    minWidth={0}
                    bgcolor="#fafafa"
                    p={2}
                    borderRadius={2}
                  >
                    <Typography variant="h4" gutterBottom>
                      Preview
                    </Typography>
                    <Preview blocks={blocks} />
                  </Box>
                </Box>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/preview" element={<PreviewPage />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
