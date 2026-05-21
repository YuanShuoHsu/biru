import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

const VALUES = [
  {
    emoji: "💙",
    title: "User-obsessed",
    desc: "We put customers first in every decision we make — always.",
  },
  {
    emoji: "🚫",
    title: "Keep it simple",
    desc: "Complexity is the enemy. We keep only what is necessary.",
  },
  {
    emoji: "🌱",
    title: 'Chase "better"',
    desc: "Continuous improvement is our daily commitment.",
  },
  {
    emoji: "🚀",
    title: "Trust and deliver together",
    desc: "We ship on our promises, every single time.",
  },
];

const ValuesSection = () => (
  <Box sx={{ py: { xs: 10, sm: 14 }, bgcolor: "background.paper" }}>
    <Container maxWidth="lg">
      <Typography
        variant="h3"
        sx={{ fontWeight: 800, mb: 1, textAlign: "center" }}
      >
        The Biru team pact
      </Typography>
      <Typography color="text.secondary" sx={{ textAlign: "center", mb: 8 }}>
        The values that guide how we work together and serve our community.
      </Typography>
      <Grid container spacing={4}>
        {VALUES.map((v) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={v.title}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                p: 1,
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 4 },
              }}
            >
              <CardContent>
                <Typography sx={{ fontSize: "2rem", mb: 1 }}>
                  {v.emoji}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {v.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {v.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default ValuesSection;
