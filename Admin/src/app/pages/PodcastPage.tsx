import { Box, Typography } from "@mui/material";
import PodcastTable from "../components/Table/PodcastTable";

const PodcastPage = () => {
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
          Podcast
        </Typography>
      </Box>
      <PodcastTable />
    </>
  );
};

export default PodcastPage;
