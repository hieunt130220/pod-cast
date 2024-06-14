import { Box, Typography } from "@mui/material";
import UserTable from "../components/Table/UserTable";

const UserPage = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" fontWeight="500">
          Users
        </Typography>
      </Box>
      <UserTable />
    </>
  );
};

export default UserPage;
