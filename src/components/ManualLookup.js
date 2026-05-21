import React, { useState, useRef } from 'react';

const ManualLookup = ({ selectedCode, searchTerm }) => {
  const [uploadedManual, setUploadedManual] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef(null);

  // OBD-II code to search terms mapping
  const codeSearchTerms = {
    'P0137': ['oxygen sensor', 'O2 sensor', 'low voltage', 'bank 1 sensor 2', 'downstream sensor'],
    'P0420': ['catalytic converter', 'catalyst efficiency', 'O2 sensor', 'exhaust leak', 'emissions'],
    'P0300': ['misfire', 'spark plugs', 'ignition coils', 'fuel injectors', 'vacuum leak', 'cylinder'],
    'P0171': ['lean', 'MAF sensor', 'mass air flow', 'vacuum leak', 'fuel pump', 'fuel filter', 'intake gasket'],
    'P0455': ['EVAP', 'gas cap', 'purge valve', 'vent valve', 'EVAP hose', 'large leak', 'emissions'],
    'P0128': ['thermostat', 'coolant', 'cooling system', 'temperature', 'below regulating'],
    'P0113': ['intake air temperature', 'IAT sensor', 'air temperature', 'high input', 'sensor'],
    'P0442': ['EVAP', 'small leak', 'gas cap', 'purge valve', 'vent valve', 'emissions'],
    'P0301': ['cylinder 1', 'misfire', 'spark plug', 'ignition coil', 'fuel injector'],
    'P0507': ['idle control', 'idle air control', 'IAC', 'RPM', 'high idle', 'throttle']
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only');
      return;
    }

    setUploading(true);
    
    try {
      // Simulate file upload - in real app, this would upload to server
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUploadedManual({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        uploadDate: new Date().toLocaleDateString(),
        // In real app, this would be the server URL
        url: URL.createObjectURL(file)
      });
      
      // Auto-search if there's a selected code
      if (selectedCode) {
        setTimeout(() => searchManual(selectedCode), 500);
      }
    } catch (error) {
      alert('Failed to upload manual. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const searchManual = (code) => {
    if (!uploadedManual) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate PDF text search - in real app, this would extract and search actual PDF text
    setTimeout(() => {
      const terms = codeSearchTerms[code] || [code];
      const mockResults = terms.map((term, index) => ({
        id: index + 1,
        term: term,
        section: `Section ${Math.floor(Math.random() * 20) + 1}`,
        page: Math.floor(Math.random() * 200) + 1,
        excerpt: `This section discusses ${term} in detail. The manual provides step-by-step procedures for diagnosis and repair of ${term} related issues. Refer to the troubleshooting guide for common problems.`,
        relevance: Math.random() > 0.5 ? 'High' : 'Medium'
      }));
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  React.useEffect(() => {
    if (selectedCode && uploadedManual) {
      searchManual(selectedCode);
    }
  }, [selectedCode]);

  if (!selectedCode || selectedCode === 'NONE') {
    return (
      <div className="pixel-card h-100">
        <h2>MANUAL LOOKUP</h2>
        <div className="text-center py-5">
          <div className="mb-3">📄</div>
          <p className="small-text text-muted">
            {selectedCode === 'NONE' 
              ? 'Select problem categories below to search the manual'
              : 'Select an OBD-II code to search the manual'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-card h-100">
      <h2>MANUAL LOOKUP</h2>
      
      {/* Upload Section */}
      <div className="mb-4">
        <div className="section-title mb-3" style={{ color: 'var(--retro-amber)', fontSize: '0.8rem' }}>
          CAR MANUAL UPLOAD
        </div>
        
        {!uploadedManual ? (
          <div className="text-center">
            <div className="upload-area border border-retro-border rounded p-4 mb-3">
              <div className="mb-3">📄</div>
              <p className="small-text mb-3">
                Upload your vehicle's repair manual (PDF only)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button 
                className="retro-button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'UPLOADING...' : 'CHOOSE PDF'}
              </button>
            </div>
          </div>
        ) : (
          <div className="uploaded-manual p-3 border border-retro-border rounded mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div className="fw-bold" style={{ color: 'var(--retro-green)' }}>
                  {uploadedManual.name}
                </div>
                <div className="small-text text-muted">
                  {uploadedManual.size} • Uploaded {uploadedManual.uploadDate}
                </div>
              </div>
              <button 
                className="retro-button danger small"
                onClick={() => {
                  setUploadedManual(null);
                  setSearchResults([]);
                }}
              >
                REMOVE
              </button>
            </div>
            <div className="small-text text-info">
              ✅ Manual uploaded, PDF search coming soon
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {uploadedManual && (
        <div>
          <div className="section-title mb-3" style={{ color: 'var(--retro-amber)', fontSize: '0.8rem' }}>
            SEARCH RESULTS
            {selectedCode && (
              <span className="ms-2 small-text" style={{ color: 'var(--retro-dim-text)' }}>
                for {selectedCode}
              </span>
            )}
          </div>
          
          {isSearching ? (
            <div className="text-center py-4">
              <div className="small-text text-muted">Searching manual...</div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="search-results">
              {searchResults.map(result => (
                <div key={result.id} className="search-result p-3 border border-retro-border rounded mb-2">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <div className="fw-bold" style={{ color: 'var(--retro-green)' }}>
                        {result.term.toUpperCase()}
                      </div>
                      <div className="small-text text-muted">
                        {result.section} • Page {result.page}
                      </div>
                    </div>
                    <span className={`badge ${result.relevance === 'High' ? 'bg-warning' : 'bg-secondary'} small-text`}>
                      {result.relevance}
                    </span>
                  </div>
                  <div className="small-text">
                    {result.excerpt}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="small-text text-muted">
                No results found for {selectedCode} in the manual
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManualLookup;
