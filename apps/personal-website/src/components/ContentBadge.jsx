import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grow from "@mui/material/Grow";
import {
  shouldShowNewBadge,
  shouldShowUpdatedBadge,
} from "../utils/contentDates";

const ContentBadge = ({ publishDate, lastModified, className = "" }) => {
  const [badgeType, setBadgeType] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Determine badge type and visibility using utility functions
    let type = null;
    let visible = false;

    // New content: published within last 7 days
    if (shouldShowNewBadge(publishDate)) {
      type = 'new';
      visible = true;
    }
    // Updated content: modified within last 30 days (but not new)
    else if (shouldShowUpdatedBadge(publishDate, lastModified)) {
      type = 'updated';
      visible = true;
    }

    setBadgeType(type);
    setIsVisible(visible);
  }, [publishDate, lastModified]);

  if (!isVisible || !badgeType) {
    return null;
  }

  return (
    <Grow in timeout={220}>
      <Box
        className={className}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 2,
        }}
      >
        <Chip
          label={badgeType === "new" ? "New" : "Updated"}
          size="small"
          color={badgeType === "new" ? "error" : "info"}
          sx={{
            fontWeight: 700,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            boxShadow: "0 8px 18px rgba(15,23,42,0.2)",
          }}
        />
      </Box>
    </Grow>
  );
};

export default ContentBadge;
