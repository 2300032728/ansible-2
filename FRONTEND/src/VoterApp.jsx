import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  MenuItem,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

export default function VoterApp() {
  const baseUrl = `http://localhost:30025`;
  const [voter, setVoter] = useState({
    id: "",
    name: "",
    age: "",
    number: "",
    gender: "",
  });
  const [voterData, setVoterData] = useState(null);
  const [id, setId] = useState("");
  const [allVoters, setAllVoters] = useState([]);

  // Load all voters automatically on mount
  useEffect(() => {
    const fetchAllVoters = async () => {
      try {
        const res = await axios.get(`${baseUrl}/all`);
        setAllVoters(res.data);
      } catch (err) {
        console.error("Error fetching all voters", err);
      }
    };
    fetchAllVoters();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setVoter({ ...voter, [e.target.name]: e.target.value });
  };

  // Add voter with validation
  const handleAdd = async (e) => {
    e.preventDefault();

    const { id, name, age, number, gender } = voter;

    // Validation
    if (!id || !name || !age || !number || !gender) {
      alert("Please fill all fields!");
      return;
    }
    if (Number(age) < 18) {
      alert("Voter must be 18 years or older!");
      return;
    }
    if (!/^\d{10}$/.test(number)) {
      alert("Mobile number must be exactly 10 digits!");
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/add`, voter);
      alert(res.data);

      // Refresh voter list
      const allRes = await axios.get(`${baseUrl}/all`);
      setAllVoters(allRes.data);

      setVoter({ id: "", name: "", age: "", number: "", gender: "" });
    } catch (err) {
      console.error("Error adding voter", err);
      alert("Error while adding voter.");
    }
  };

  // Get voter by ID
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!id) {
      alert("Please enter an ID to search!");
      return;
    }
    try {
      const res = await axios.get(`${baseUrl}/get/${id}`);
      setVoterData(res.data);
      alert("Voter Found");
      setId("");
    } catch (err) {
      alert("Voter Not Found");
      console.error("Error fetching voter", err);
    }
  };

  return (
    <Box className="container mt-4">
      <Typography variant="h4" align="center" gutterBottom>
        🗳️ Voter Management System
      </Typography>

      <div className="row">
        {/* Add Voter Form */}
        <div className="col-md-6 mb-4">
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add Voter
              </Typography>
              <form onSubmit={handleAdd}>
                <TextField
                  fullWidth
                  margin="dense"
                  label="ID"
                  type="number"
                  name="id"
                  value={voter.id}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Name"
                  name="name"
                  value={voter.name}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Age"
                  type="number"
                  name="age"
                  value={voter.age}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Mobile Number"
                  name="number"
                  value={voter.number}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Gender"
                  name="gender"
                  select
                  value={voter.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Add Voter
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Search Voter by ID */}
        <div className="col-md-6 mb-4">
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Search Voter by ID
              </Typography>
              <form onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Enter ID"
                  type="number"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Search
                </Button>
              </form>

              {/* Display Single Voter */}
              {voterData && (
                <Box
                  sx={{
                    mt: 3,
                    border: "1px solid #ddd",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle1">
                    <b>ID:</b> {voterData.id}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Name:</b> {voterData.name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Age:</b> {voterData.age}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Mobile:</b> {voterData.number}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Gender:</b> {voterData.gender}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Display All Voters Automatically */}
      {allVoters.length > 0 && (
        <TableContainer component={Paper} elevation={5}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>ID</TableCell>
                <TableCell sx={{ color: "white" }}>Name</TableCell>
                <TableCell sx={{ color: "white" }}>Age</TableCell>
                <TableCell sx={{ color: "white" }}>Mobile</TableCell>
                <TableCell sx={{ color: "white" }}>Gender</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allVoters.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.id}</TableCell>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.age}</TableCell>
                  <TableCell>{v.number}</TableCell>
                  <TableCell>{v.gender}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}