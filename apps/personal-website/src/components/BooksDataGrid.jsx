import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const truncate = (value = "", max = 120) => {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max).trim()}…` : value;
};

export default function BooksDataGrid({ books = [] }) {
  const navigate = useNavigate();

  const rows = useMemo(
    () =>
      books.map((book, index) => {
        const publishTimestamp = book.publishDate
          ? Date.parse(book.publishDate)
          : null;
        return {
          id: book.slug || index,
          slug: book.slug,
          title: book.title || "Untitled",
          author: book.author || "Unknown",
          tags: Array.isArray(book.tags) ? book.tags : [],
          summary: book.summary || book.description || "",
          publishDate: book.publishDate || "Unscheduled",
          publishDateValue: Number.isFinite(publishTimestamp)
            ? publishTimestamp
            : null,
          readingTime: book.readingTime || "—",
          url: book.slug ? `/books/${book.slug}` : "#",
        };
      }),
    [books],
  );

  const columns = useMemo(
    () => [
      {
        field: "title",
        headerName: "Title",
        flex: 1.4,
        minWidth: 220,
        renderCell: (params) => (
          <Link
            to={params.row.url}
            className="text-blue-600 dark:text-sky-300 font-semibold hover:underline"
          >
            {params.value}
          </Link>
        ),
      },
      {
        field: "author",
        headerName: "Author",
        flex: 1,
        minWidth: 180,
      },
      {
        field: "tags",
        headerName: "Tags",
        flex: 1,
        minWidth: 200,
        sortable: false,
        renderCell: (params) => {
          const tags = Array.isArray(params.value) ? params.value : [];
          if (tags.length === 0) {
            return <span className="text-gray-500 dark:text-slate-400">—</span>;
          }
          const visible = tags.slice(0, 3);
          const remaining = tags.length - visible.length;
          return (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ flexWrap: "wrap", maxWidth: "100%" }}
            >
              {visible.map((tag) => (
                <Chip
                  key={`${params.row.id}-${tag}`}
                  label={tag}
                  size="small"
                  variant="outlined"
                />
              ))}
              {remaining > 0 && (
                <Chip
                  size="small"
                  label={`+${remaining}`}
                  variant="outlined"
                  color="primary"
                />
              )}
            </Stack>
          );
        },
      },
      {
        field: "publishDate",
        headerName: "Published",
        flex: 0.6,
        minWidth: 150,
        sortComparator: (v1, v2, cellParams1, cellParams2) => {
          const a = cellParams1?.row?.publishDateValue ?? 0;
          const b = cellParams2?.row?.publishDateValue ?? 0;
          return a - b;
        },
      },
      {
        field: "readingTime",
        headerName: "Reading Time",
        flex: 0.5,
        minWidth: 140,
      },
      {
        field: "summary",
        headerName: "Summary",
        flex: 2,
        minWidth: 260,
        sortable: false,
        renderCell: (params) => (
          <span className="text-sm text-gray-600 dark:text-slate-300">
            {truncate(params.value, 160)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <Box
      sx={{
        borderRadius: 3,
        boxShadow:
          "0 10px 50px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.1)",
        backgroundColor: "var(--mui-palette-background-paper)",
        border: "1px solid rgba(148, 163, 184, 0.15)",
      }}
      className="p-4 sm:p-6 space-y-4"
    >
      <div>
        <Typography
          variant="h5"
          component="h2"
          fontWeight={700}
          gutterBottom
          className="text-slate-900 dark:text-white"
        >
          Interactive book catalog (MUI X v8)
        </Typography>
        <Typography
          variant="body1"
          className="text-slate-600 dark:text-slate-300"
        >
          Explore every title using the upgraded MUI X Data Grid—try the quick
          filter, column pinning, density controls, and keyboard navigation to
          feel the v8 improvements.
        </Typography>
      </div>

      <Box
        sx={{
          height: 520,
          width: "100%",
          "& .MuiDataGrid-root": {
            borderRadius: 2,
            borderColor: "rgba(148, 163, 184, 0.3)",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(15, 23, 42, 0.02)",
            backdropFilter: "blur(6px)",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          density="compact"
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
            sorting: {
              sortModel: [{ field: "publishDate", sort: "desc" }],
            },
            columns: {
              columnVisibilityModel: { summary: books.length <= 4 ? true : false },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 400 },
            },
          }}
          onRowClick={(params) => {
            if (params?.row?.url && params.row.url !== "#") {
              navigate(params.row.url);
            }
          }}
        />
      </Box>
    </Box>
  );
}
