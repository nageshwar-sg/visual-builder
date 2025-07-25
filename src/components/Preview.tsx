import React from "react";
import { Box, Typography } from "@mui/material";

interface Block {
  id: string;
  type: "text" | "image";
  content: string;
}

interface PreviewProps {
  blocks: Block[];
}

const Preview: React.FC<PreviewProps> = ({ blocks }) => (
  <Box display="flex" flexDirection="column" gap={2}>
    {blocks.map((block) => (
      <Box key={block.id} p={2} borderRadius={2} bgcolor="#fff" boxShadow={1}>
        {block.type === "text" ? (
          <Typography variant="body1">{block.content}</Typography>
        ) : (
          <img
            src={block.content}
            alt="preview"
            style={{ maxWidth: 200, borderRadius: 8 }}
          />
        )}
      </Box>
    ))}
  </Box>
);

export default Preview;
