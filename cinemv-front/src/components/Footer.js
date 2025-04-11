import { Container, Typography, Box } from "@mui/material";

function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#095d40" }}
      className="mt-auto text-white w-full"
    >
      <Container sx={{ py: 4 }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          textAlign={{ xs: "center", sm: "left" }}
        >
          <Typography variant="body2" color="white">
            &copy; 2025 Ciné'MV
          </Typography>
        </Box>
      </Container>
    </footer>
  );
}

export default Footer;
