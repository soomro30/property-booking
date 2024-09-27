import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { CloudUpload as CloudUploadIcon, FileDownload as FileDownloadIcon } from '@mui/icons-material';
import Papa from 'papaparse';
import { createUnit, getPropertyIdByName, getFloorIdByNumber, getUnitTypeIdByName, getBedroomIdByNumber } from './UnitActions';

export const ImportExportButtons = ({ showSnackbar, refreshUnits }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCSVImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          for (const row of results.data) {
            const propertyId = await getPropertyIdByName(row['property_name']);
            const [floorId, unitTypeId, bedroomId] = await Promise.all([
              getFloorIdByNumber(parseInt(row['floor_number']), propertyId),
              getUnitTypeIdByName(row['unit_type']),
              getBedroomIdByNumber(parseInt(row['number_of_bedrooms']))
            ]);

            const unit = {
              unit_number: row['unit_number'],
              property_id: propertyId,
              floor_id: floorId,
              unit_type_id: unitTypeId,
              bedroom_id: bedroomId,
              status: row['status'] ? row['status'].trim() : null,
              square_footage: row['square_footage'] ? parseInt(row['square_footage']) : null,
              bathrooms: row['bathrooms'] ? parseInt(row['bathrooms']) : null,
              "30_70_sale_price": row['30_70_sale_price'] ? parseFloat(row['30_70_sale_price']) : null,
              "40_60_full_comp_price": row['40_60_full_comp_price'] ? parseFloat(row['40_60_full_comp_price']) : null,
              plot_id_adm: row['plot_id_adm'] ? parseInt(row['plot_id_adm']) : null,
              virtual_account_no: row['virtual_account_no'] ? parseInt(row['virtual_account_no']) : null,
              bua: row['bua'] ? parseInt(row['bua']) : null,
              sellable_area: row['sellable_area'] ? parseInt(row['sellable_area']) : null,
              release: row['release'],
              amenities: row['amenities'],
              post_2_year_payment_price: row['post_2_year_payment_price'] ? parseFloat(row['post_2_year_payment_price']) : null,
              post_3_year_payment_price: row['post_3_year_payment_price'] ? parseFloat(row['post_3_year_payment_price']) : null,
              post_4_year_payment_price: row['post_4_year_payment_price'] ? parseFloat(row['post_4_year_payment_price']) : null,
              customer_virtual_iban_number: row['customer_virtual_iban_number']
            };

            await createUnit(Object.fromEntries(Object.entries(unit).filter(([_, v]) => v != null)));
          }
          showSnackbar('Units imported successfully', 'success');
          refreshUnits();
        } catch (error) {
          console.error('Error processing CSV:', error);
          showSnackbar('Error processing CSV: ' + error.message, 'error');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleDownloadSampleCSV = () => {
    const sampleData = [
      {
        unit_number: '101',
        floor_number: '1',
        property_name: 'Property A',
        unit_type: 'Type 1',
        number_of_bedrooms: '2',
        status: 'Available',
        square_footage: '1000',
        bathrooms: '2',
        "30_70_sale_price": '300000',
        "40_60_full_comp_price": '400000',
        plot_id_adm: '123',
        virtual_account_no: '456',
        bua: '1200',
        sellable_area: '1100',
        release: '2023-01-01',
        amenities: 'Pool, Gym',
        post_2_year_payment_price: '320000',
        post_3_year_payment_price: '330000',
        post_4_year_payment_price: '340000',
        customer_virtual_iban_number: 'IBAN123456'
      }
    ];
    
    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'sample_units.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <input
        accept=".csv"
        style={{ display: 'none' }}
        id="csv-file"
        type="file"
        onChange={handleCSVImport}
      />
      <label htmlFor="csv-file">
        <Button
          variant="contained"
          component="span"
          startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <CloudUploadIcon />}
          sx={{ mb: 2, ml: 2, }}
          disabled={isLoading}
        >
          {isLoading ? 'Importing...' : 'Import CSV'}
        </Button>
      </label>
      <Button
        variant="contained"
        startIcon={<FileDownloadIcon />}
        onClick={handleDownloadSampleCSV}
        sx={{ mb: 2, ml: 2,  }}
        disabled={isLoading}
      >
        Download Sample CSV
      </Button>
    </>
  );
};