// VisualBuilder component for drag-and-drop visual editing
import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Paper, Typography, TextField } from "@mui/material";
import { fetchEntries, updateEntry } from "../utils/contentstack";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

interface Block {
  id: string;
  type: "text" | "image";
  content: string;
}

const ItemType = {
  BLOCK: "block",
};

const DraggableBlock: React.FC<{
  block: Block;
  index: number;
  moveBlock: (from: number, to: number) => void;
  handleTextChange: (id: string, value: string) => void;
  onDelete: (id: string) => void;
}> = ({ block, index, moveBlock, handleTextChange, onDelete }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ItemType.BLOCK,
    hover(item: unknown) {
      const dragItem = item as { index: number };
      if (!ref.current) return;
      const dragIndex = dragItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveBlock(dragIndex, hoverIndex);
      dragItem.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.BLOCK,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));
  return (
    <Paper
      ref={ref}
      sx={{
        p: 2,
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
      }}
    >
      <IconButton
        aria-label="delete block"
        size="small"
        onClick={() => onDelete(block.id)}
        sx={{ position: "absolute", top: 4, right: 4 }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      {block.type === "text" ? (
        <TextField
          value={block.content}
          onChange={(e) => handleTextChange(block.id, e.target.value)}
          fullWidth
          variant="standard"
        />
      ) : (
        <img src={block.content} alt="block" style={{ maxWidth: 200 }} />
      )}
    </Paper>
  );
};

const VisualBuilder: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [entryUid, setEntryUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function loadBlocks() {
      setLoading(true);
      try {
        // Replace 'page' with your Contentstack content type
        const entriesResult = await fetchEntries("page");
        const entries = entriesResult.items || [];
        if (entries.length > 0) {
          setBlocks(entries[0].blocks || []);
          setEntryUid(entries[0].uid);
        }
      } catch {
        setBlocks([]);
        setEntryUid(null);
        setError("Failed to fetch content from Contentstack");
      } finally {
        setLoading(false);
      }
    }
    loadBlocks();
  }, []);

  const addTextBlock = () => {
    setBlocks([
      ...blocks,
      { id: Date.now().toString(), type: "text", content: "New Text" },
    ]);
  };
  const addImageBlock = () => {
    setBlocks([
      ...blocks,
      {
        id: Date.now().toString(),
        type: "image",
        content: "https://via.placeholder.com/150",
      },
    ]);
  };

  const handleTextChange = (id: string, value: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content: value } : b)));
  };

  const moveBlock = (from: number, to: number) => {
    if (from === to) return;
    const updated = [...blocks];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setBlocks(updated);
  };

  const handleSync = async () => {
    if (!entryUid) return;
    setSyncing(true);
    try {
      await updateEntry("page", entryUid, { blocks });
      setSuccess("Synced with Contentstack!");
    } catch {
      setError("Failed to sync with Contentstack");
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };
  const confirmDelete = () => {
    if (deleteId) {
      setBlocks(blocks.filter((b) => b.id !== deleteId));
      setSuccess("Block deleted");
      setDeleteId(null);
    }
  };
  const cancelDelete = () => setDeleteId(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        <Typography variant="h6">Drag and Drop Area</Typography>
        <Box display="flex" gap={2} mb={2}>
          <Button variant="outlined" onClick={addTextBlock}>
            Add Text
          </Button>
          <Button variant="outlined" onClick={addImageBlock}>
            Add Image
          </Button>
        </Box>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {blocks.map((block, idx) => (
              <DraggableBlock
                key={block.id}
                block={block}
                index={idx}
                moveBlock={moveBlock}
                handleTextChange={handleTextChange}
                onDelete={handleDelete}
              />
            ))}
          </Box>
        )}
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleSync}
          disabled={!entryUid || syncing}
        >
          {syncing ? "Syncing..." : "Sync with Contentstack"}
        </Button>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        message={success}
      />
      <Dialog open={!!deleteId} onClose={cancelDelete}>
        <DialogTitle>Delete this block?</DialogTitle>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DndProvider>
  );
};

export default VisualBuilder;

export {};
