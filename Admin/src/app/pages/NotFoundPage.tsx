import { Box, Container, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Typography variant="h2">404</Typography>
        <Typography variant="h4">Page not found</Typography>

        <Link
          component="button"
          variant="body2"
          onClick={() => {
            navigate("/users");
          }}
        >
          Back to Admin Page
        </Link>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
