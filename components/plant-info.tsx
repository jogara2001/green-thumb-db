'use client'
import { Accordion, AccordionDetails, AccordionSummary, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { type Plant } from './plant-card'
import { ArrowDropDown } from '@mui/icons-material'

export function PlantInfo (plant: Plant) {
  return (
    <Stack direction={'column'} padding={2} spacing={1}>
      <Typography variant={'h5'}>{plant.common_name.toUpperCase()}</Typography>
      <Typography variant={'body1'}>{plant.scientific_name}</Typography>
      {
        plant.native_statuses
          ? <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDown/>}
            >
              <Typography variant={'h6'}>Native Statuses</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Country</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>County</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {plant.native_statuses.map(status =>
                      <TableRow key={status.country + status.state + status.county}>
                        <TableCell>{status.country}</TableCell>
                        <TableCell>{status.state}</TableCell>
                        <TableCell>{status.county}</TableCell>
                        <TableCell>{status.status}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
          : null
      }
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDown/>}
        >
          <Typography variant={'h6'}>Characteristics</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Characteristic</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(Object.entries(plant.characteristics)).map(value =>
                  <TableRow key={value[0]}>
                    <TableCell>{value[0]}</TableCell>
                    <TableCell>{value[1]}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
           </TableContainer>
        </AccordionDetails>
      </Accordion>

    </Stack>
  )
}
