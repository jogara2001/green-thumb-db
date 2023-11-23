import { Box, Button, FormControl, FormLabel, Grid, TextField } from '@mui/material'

export default function Login () {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}
    >
      <Box
        justifyContent={'center'}
      >
        <FormControl sx={{
          gap: 2,
          padding: 2
        }}>
          <FormLabel>Login</FormLabel>
          <TextField label="Email"/>
          <TextField label="Password"/>
          <Button variant="contained">Login</Button>
          <Button>Sign Up</Button>
        </FormControl>
      </Box>
    </Grid>
  )
}
