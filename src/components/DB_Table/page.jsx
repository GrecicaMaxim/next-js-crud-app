'use client'
import "@/app/globals.css"
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


const CURRENT_YEAR = new Date().getFullYear();
const LOCAL_STORAGE_KEY = 'carti_biblioteca';

function createData(id, title, author, publicationYear, genre) {
  return {
    id,
    title,
    author,
    publicationYear,
    genre,
  };
}

const rows = [];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'ID_Carte',
  },
  {
    id: 'title',
    numeric: true,
    disablePadding: false,
    label: 'Titlu',
  },
  {
    id: 'author',
    numeric: true,
    disablePadding: false,
    label: 'Autor',
  },
  {
    id: 'publicationYear',
    numeric: true,
    disablePadding: false,
    label: 'Anul_publicarii',
  },
  {
    id: 'genre',
    numeric: true,
    disablePadding: false,
    label: 'Genul',
  },
];

const emptyAddForm = {
  id: '',
  title: '',
  author: '',
  publicationYear: '',
  genre: '',
};

const emptyAddErrors = {
  id: '',
  title: '',
  author: '',
  publicationYear: '',
  genre: '',
};

const emptyEditForm = {
  title: '',
  author: '',
  publicationYear: '',
  genre: '',
};

const emptyEditErrors = {
  title: '',
  author: '',
  publicationYear: '',
  genre: '',
  general: '',
};

function validateId(value, existingRows) {
  if (value === '' || value === null || value === undefined) {
    return 'ID-ul este obligatoriu.';
  }
  const num = Number(value);
  if (!Number.isInteger(num)) {
    return 'ID-ul trebuie să fie un număr întreg.';
  }
  if (num < 1 || num > 1000000) {
    return 'ID-ul trebuie să fie între 1 și 1.000.000.';
  }
  if (existingRows.some((row) => row.id === num)) {
    return 'Un rând cu acest ID există deja în tabel.';
  }
  return '';
}

function validateTitle(value) {
  if (!value || value.trim() === '') return 'Titlul este obligatoriu.';
  if (value.trim().length > 50) return 'Titlul nu poate depăși 50 de caractere.';
  return '';
}

function validateAuthor(value) {
  if (!value || value.trim() === '') return 'Autorul este obligatoriu.';
  if (value.trim().length > 50) return 'Autorul nu poate depăși 50 de caractere.';
  return '';
}

function validateYear(value) {
  if (value === '' || value === null || value === undefined) {
    return 'Anul publicării este obligatoriu.';
  }
  const num = Number(value);
  if (!Number.isInteger(num)) {
    return 'Anul publicării trebuie să fie un număr întreg.';
  }
  if (num < 1500 || num > CURRENT_YEAR) {
    return `Anul publicării trebuie să fie între 1500 și ${CURRENT_YEAR}.`;
  }
  return '';
}

function validateGenre(value) {
  if (!value || value.trim() === '') return 'Genul este obligatoriu.';
  if (value.trim().length > 30) return 'Genul nu poate depăși 30 de caractere.';
  return '';
}

function validateEditYear(value) {
  if (value === '' || value === null || value === undefined) return ''; // gol = nu se modifică
  const num = Number(value);
  if (!Number.isInteger(num)) {
    return 'Anul publicării trebuie să fie un număr întreg.';
  }
  if (num < 1500 || num > CURRENT_YEAR) {
    return `Anul publicării trebuie să fie între 1500 și ${CURRENT_YEAR}.`;
  }
  return '';
}

function validateEditTitle(value) {
  if (value === '' || value === null) return ''; // gol = nu se modifică
  if (value.trim().length > 50) return 'Titlul nu poate depăși 50 de caractere.';
  return '';
}

function validateEditAuthor(value) {
  if (value === '' || value === null) return ''; // gol = nu se modifică
  if (value.trim().length > 50) return 'Autorul nu poate depăși 50 de caractere.';
  return '';
}

function validateEditGenre(value) {
  if (value === '' || value === null) return ''; // gol = nu se modifică
  if (value.trim().length > 30) return 'Genul nu poate depăși 30 de caractere.';
  return '';
}

function loadRowsFromStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRowsToStorage(rows) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rows));
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onAdd, onEdit } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Aplicatie despre carti
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <Tooltip title="Actualizează rândul/rândurile selectate">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={onEdit}
              size="small"
            >
              Actualizează
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
        
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Adaugă o carte nouă">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          size="small"
        >
          Adaugă
        </Button>
      </Tooltip>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default function EnhancedTable() {
  const [rows, setRows] = React.useState(() => {
    if (typeof window === 'undefined') return []; // pe server nu există localStorage
    return loadRowsFromStorage();
  });
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [addForm, setAddForm] = React.useState(emptyAddForm);
  const [addErrors, setAddErrors] = React.useState(emptyAddErrors);
  const [warnDialogOpen, setWarnDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState(emptyEditForm);
  const [editErrors, setEditErrors] = React.useState(emptyEditErrors);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  React.useEffect(() => {
    const stored = loadRowsFromStorage();
    setRows(stored);
  }, []);

  function showSnackbar(message, severity = 'success') {
    setSnackbar({ open: true, message, severity });
  }

  function handleSnackbarClose() {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage],
  );

  function handleOpenAddDialog() {
    setAddForm(emptyAddForm);
    setAddErrors(emptyAddErrors);
    setAddDialogOpen(true);
  }

  function handleCloseAddDialog() {
    setAddDialogOpen(false);
  }

  function handleAddFormChange(e) {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
    setAddErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleAddSubmit() {
    const errors = {
      id:              validateId(addForm.id, rows),
      title:           validateTitle(addForm.title),
      author:          validateAuthor(addForm.author),
      publicationYear: validateYear(addForm.publicationYear),
      genre:           validateGenre(addForm.genre),
    };

    setAddErrors(errors);

    if (Object.values(errors).some((e) => e !== '')) return;

    const newRow = {
      id:              Number(addForm.id),
      title:           addForm.title.trim(),
      author:          addForm.author.trim(),
      publicationYear: Number(addForm.publicationYear),
      genre:           addForm.genre.trim(),
    };

    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    saveRowsToStorage(updatedRows);
    setAddDialogOpen(false);
    showSnackbar('Cartea a fost adăugată cu succes!');
  }

  function handleOpenEditFlow() {
    if (selected.length > 1) {
      setWarnDialogOpen(true);
    } else {
      openEditDialog();
    }
  }

  function handleWarnConfirm() {
    setWarnDialogOpen(false);
    openEditDialog();
  }

  function handleWarnCancel() {
    setWarnDialogOpen(false);
  }

  function openEditDialog() {
    setEditForm(emptyEditForm);
    setEditErrors(emptyEditErrors);
    setEditDialogOpen(true);
  }

  function handleCloseEditDialog() {
    setEditDialogOpen(false);
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  }

  function handleEditSubmit() {
    const allEmpty =
      editForm.title.trim() === '' &&
      editForm.author.trim() === '' &&
      editForm.publicationYear.trim() === '' &&
      editForm.genre.trim() === '';

    if (allEmpty) {
      setEditErrors((prev) => ({
        ...prev,
        general: 'Cel puțin un câmp trebuie completat pentru a efectua actualizarea.',
      }));
      return;
    }

    const errors = {
      title: validateEditTitle(editForm.title),
      author: validateEditAuthor(editForm.author),
      publicationYear: validateEditYear(editForm.publicationYear),
      genre: validateEditGenre(editForm.genre),
      general: '',
    };

    setEditErrors(errors);

    const hasFieldError = ['title', 'author', 'publicationYear', 'genre'].some(
      (key) => errors[key] !== ''
    );
    if (hasFieldError) return;

    const updatedRows = rows.map((row) => {
      if (!selected.includes(row.id)) return row;

      return {
        ...row,
        title: editForm.title.trim() !== '' ? editForm.title.trim() : row.title,
        author: editForm.author.trim() !== '' ? editForm.author.trim() : row.author,
        publicationYear: editForm.publicationYear.trim() !== '' ? Number(editForm.publicationYear) : row.publicationYear,
        genre: editForm.genre.trim() !== '' ? editForm.genre.trim() : row.genre,
      };
    });

    setRows(updatedRows);
    saveRowsToStorage(updatedRows);
    setEditDialogOpen(false);
    setSelected([]);
    showSnackbar(
      selected.length === 1
        ? 'Cartea a fost actualizată cu succes!'
        : `${selected.length} cărți au fost actualizate cu succes!`
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onAdd={handleOpenAddDialog}
          onEdit={handleOpenEditFlow}
        />
        <Divider />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              ({visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => handleClick(event, row.id)}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.author}</TableCell>
                    <TableCell align="right">{row.publicationYear}</TableCell>
                    <TableCell>{row.genre}</TableCell>
                  </TableRow>
                );
              })})
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Adaugă o carte nouă</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>

            <TextField
              label="ID Carte"
              name="id"
              value={addForm.id}
              onChange={handleAddFormChange}
              type="number"
              error={!!addErrors.id}
              helperText={addErrors.id || 'Număr întreg între 1 și 1.000.000'}
              fullWidth
              required
              inputProps={{ min: 1, max: 1000000 }}
            />

            <TextField
              label="Titlu"
              name="title"
              value={addForm.title}
              onChange={handleAddFormChange}
              error={!!addErrors.title}
              helperText={addErrors.title || 'Maxim 50 de caractere'}
              fullWidth
              required
              inputProps={{ maxLength: 50 }}
            />

            <TextField
              label="Autor"
              name="author"
              value={addForm.author}
              onChange={handleAddFormChange}
              error={!!addErrors.author}
              helperText={addErrors.author || 'Maxim 50 de caractere'}
              fullWidth
              required
              inputProps={{ maxLength: 50 }}
            />

            <TextField
              label="Anul publicării"
              name="publicationYear"
              value={addForm.publicationYear}
              onChange={handleAddFormChange}
              type="number"
              error={!!addErrors.publicationYear}
              helperText={addErrors.publicationYear || `Număr întreg între 1500 și ${CURRENT_YEAR}`}
              fullWidth
              required
              inputProps={{ min: 1500, max: CURRENT_YEAR }}
            />

            <TextField
              label="Gen"
              name="genre"
              value={addForm.genre}
              onChange={handleAddFormChange}
              error={!!addErrors.genre}
              helperText={addErrors.genre || 'Maxim 30 de caractere'}
              fullWidth
              required
              inputProps={{ maxLength: 30 }}
            />

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="inherit">Anulează</Button>
          <Button onClick={handleAddSubmit} variant="contained">Adaugă</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={warnDialogOpen} onClose={handleWarnCancel} maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="warning" />
          Atenție: editare multiplă
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ai selectat <strong>{selected.length} rânduri</strong>. Câmpurile completate în
            formularul următor vor fi aplicate <strong>tuturor rândurilor selectate</strong> cu
            valori identice. Ești sigur că dorești să continui?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWarnCancel} color="inherit">Anulează</Button>
          <Button onClick={handleWarnConfirm} variant="contained" color="warning">
            Da, continuă
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Actualizează {selected.length === 1 ? 'cartea selectată' : `cele ${selected.length} cărți selectate`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Completează doar câmpurile pe care dorești să le modifici. Câmpurile lăsate goale
            nu vor fi modificate.
          </DialogContentText>

          {editErrors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editErrors.general}
            </Alert>
          )}

          <Stack spacing={2}>

            <TextField
              label="Titlu"
              name="title"
              value={editForm.title}
              onChange={handleEditFormChange}
              error={!!editErrors.title}
              helperText={editErrors.title || 'Lăsați gol pentru a nu modifica (maxim 50 caractere)'}
              fullWidth
              inputProps={{ maxLength: 50 }}
            />

            <TextField
              label="Autor"
              name="author"
              value={editForm.author}
              onChange={handleEditFormChange}
              error={!!editErrors.author}
              helperText={editErrors.author || 'Lăsați gol pentru a nu modifica (maxim 50 caractere)'}
              fullWidth
              inputProps={{ maxLength: 50 }}
            />

            <TextField
              label="Anul publicării"
              name="publicationYear"
              value={editForm.publicationYear}
              onChange={handleEditFormChange}
              type="number"
              error={!!editErrors.publicationYear}
              helperText={editErrors.publicationYear || `Lăsați gol pentru a nu modifica (1500–${CURRENT_YEAR})`}
              fullWidth
              inputProps={{ min: 1500, max: CURRENT_YEAR }}
            />

            <TextField
              label="Gen"
              name="genre"
              value={editForm.genre}
              onChange={handleEditFormChange}
              error={!!editErrors.genre}
              helperText={editErrors.genre || 'Lăsați gol pentru a nu modifica (maxim 30 caractere)'}
              fullWidth
              inputProps={{ maxLength: 30 }}
            />

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="inherit">Anulează</Button>
          <Button onClick={handleEditSubmit} variant="contained">Salvează</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
