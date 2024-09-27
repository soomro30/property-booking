import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import axios from 'axios';
import { IconSettings } from '@salesforce/design-system-react';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import Modal from '@salesforce/design-system-react/components/modal';
import Button from '@salesforce/design-system-react/components/button';
import * as XLSX from 'xlsx';

const DataSubmissions = () => {
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerStyle = useMemo(() => ({ width: '100%', height: '100vh' }), []);
  const gridStyle = useMemo(() => ({ 
    height: 'calc(100% - 120px)', 
    width: '100%'
  }), []);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('https://api.jotform.com/form/242253667987472/submissions', {
        params: {
          apiKey: '51e28f19eaafaf235709b5dd535b8c5b'
        }
      });

      if (response.data && response.data.content) {
        processSubmissions(response.data.content);
      } else {
        throw new Error('No data received from JotForm API');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError(error.message || 'An error occurred while fetching submissions');
    } finally {
      setLoading(false);
    }
  };

  const processSubmissions = (submissions) => {
    if (submissions.length > 0) {
      const processedSubmissions = submissions.map((submission, index) => {
        const processedAnswers = { serialNumber: index + 1 };
        Object.keys(submission.answers).forEach(key => {
          const answer = submission.answers[key];
          if (answer.answer !== '' && answer.name !== 'submit' && !answer.name.includes('divider') && !answer.name.includes('click') && answer.name !== 'SubmitForm' && answer.name !== 'submitForm') {
            if (typeof answer.answer === 'object' && answer.answer !== null) {
              Object.keys(answer.answer).forEach(subKey => {
                processedAnswers[`${answer.name}_${subKey}`] = answer.answer[subKey];
              });
            } else {
              processedAnswers[answer.name] = answer.answer;
            }
          }
        });
        return processedAnswers;
      });

      const allFields = new Set(['serialNumber']);
      processedSubmissions.forEach(submission => {
        Object.keys(submission).forEach(key => allFields.add(key));
      });

      const columns = Array.from(allFields)
        .map(key => ({
          headerName: key === 'serialNumber' ? 'S.No' : key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          field: key,
          filter: true,
          sortable: true,
          cellRenderer: (params) => {
            if (typeof params.value === 'string' && params.value.startsWith('http')) {
              return (
                <Button
                  variant="base"
                  onClick={() => handleAttachmentClick(params.value)}
                  style={{ color: '#1589ee', padding: 0, background: 'none', border: 'none' }}
                >
                  View Attachment
                </Button>
              );
            }
            return params.value;
          }
        }));

      setColumnDefs(columns);
      setRowData(processedSubmissions);
    } else {
      setError('No submissions found');
    }
  };

  const handleAttachmentClick = useCallback((url) => {
    const fileExtension = url.split('.').pop().toLowerCase();
    if (fileExtension === 'pdf') {
      window.open(url, '_blank');
    } else {
      setModalContent(url);
      setIsModalOpen(true);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 150,
    filter: true,
    sortable: true,
    resizable: true,
  }), []);

  const onGridReady = useCallback((params) => {
    const gridApi = params.api;
    const gridColumnApi = params.columnApi;

    const updateGridSize = () => {
      if (gridApi && gridColumnApi) {
        setTimeout(() => {
          gridApi.sizeColumnsToFit();
        }, 0);
      }
    };

    window.addEventListener('resize', updateGridSize);

    return () => {
      window.removeEventListener('resize', updateGridSize);
    };
  }, []);

  const getRowClass = (params) => {
    return params.node.rowIndex % 2 === 0 ? 'stripe-even' : 'stripe-odd';
  };

  const exportToExcel = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      const params = {
        skipHeader: false,
        skipFooters: true,
        skipGroups: true,
        fileName: 'broker_submissions.xlsx',
      };
      
      const columnKeys = columnDefs.map(column => column.field);
      
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(
        gridRef.current.api.getDataAsCsv(params)
          .split('\n')
          .map(row => row.split(','))
          .slice(1) // Remove header row
          .map(row => {
            const obj = {};
            columnKeys.forEach((key, index) => {
              obj[key] = row[index];
            });
            return obj;
          })
      );
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
      XLSX.writeFile(workbook, params.fileName);
    }
  }, [columnDefs]);

  if (loading) {
    return (
      <div className="slds-align_absolute-center" style={{ height: '100vh' }}>
        <div className="slds-spinner slds-spinner_large" role="status">
          <span className="slds-assistive-text">Loading submissions</span>
          <div className="slds-spinner__dot-a"></div>
          <div className="slds-spinner__dot-b"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="slds-p-around_medium">
        <div className="slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error" role="alert">
          <span className="slds-assistive-text">error</span>
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
      <div style={containerStyle}>
        <div className="slds-p-around_medium" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="slds-grid slds-grid_vertical-align-center slds-m-bottom_medium">
            <h1 className="slds-text-heading_large slds-col">Brokers Submissions</h1>
            <Button
              label="Download Excel"
              onClick={exportToExcel}
              className="slds-col_bump-left"
            />
          </div>
          {rowData.length > 0 ? (
            <div className="ag-theme-alpine" style={gridStyle}>
              <style>
                {`
                  .stripe-even { background-color: #f3f3f3; }
                  .stripe-odd { background-color: #ffffff; }
                  .ag-theme-balham {
                    font-family: "Salesforce Sans", Arial, sans-serif;
                  }
                  .ag-theme-balham .ag-header-cell-label {
                    font-family: "Salesforce Sans", Arial, sans-serif;
                  }
                  .ag-theme-balham .ag-cell {
                    font-family: "Salesforce Sans", Arial, sans-serif;
                  }
                  .ag-theme-balham .ag-header {
                    background-color: #fafaf9;
                    color: #514f4d;
                  }
                  .ag-theme-balham .ag-header-cell {
                    padding: .25rem .5rem;
                    font-weight: 700;
                    line-height: normal;
                  }
                `}
              </style>
              <AgGridReact
                ref={gridRef}
                columnDefs={columnDefs}
                rowData={rowData}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                pagination={true}
                paginationPageSize={20}
                animateRows={true}
                enableRangeSelection={true}
                enableColumnMoving={true}
                enableColumnResizing={true}
                suppressRowClickSelection={true}
                rowSelection="multiple"
                domLayout='autoHeight'
                getRowClass={getRowClass}
              />
            </div>
          ) : (
            <p className="slds-text-body_regular">No submissions available</p>
          )}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            size="large"
            heading="Attachment"
          >
            <section className="slds-modal__content slds-p-around_medium">
              {modalContent && (
                <img src={modalContent} alt="Attachment" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
              )}
            </section>
            <footer className="slds-modal__footer">
              <Button label="Close" onClick={handleCloseModal} />
            </footer>
          </Modal>
        </div>
      </div>
    </IconSettings>
  );
};

export default DataSubmissions;
