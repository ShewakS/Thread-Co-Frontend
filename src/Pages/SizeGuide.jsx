import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const SizeGuide = () => {
  const [unit, setUnit] = useState('inches'); // inches, cm

  const convertVal = (val, toUnit) => {
    if (toUnit === 'cm') return Math.round(val * 2.54);
    return val;
  };

  const menSizes = [
    { size: 'S', chest: 36, waist: 30, shoulder: 17, length: 27 },
    { size: 'M', chest: 39, waist: 33, shoulder: 18, length: 28 },
    { size: 'L', chest: 42, waist: 36, shoulder: 19, length: 29 },
    { size: 'XL', chest: 45, waist: 39, shoulder: 20, length: 30 },
    { size: 'XXL', chest: 48, waist: 42, shoulder: 21, length: 31 }
  ];

  const womenSizes = [
    { size: 'S', bust: 32, waist: 25, hips: 34, length: 35 },
    { size: 'M', bust: 34, waist: 28, hips: 36, length: 36 },
    { size: 'L', bust: 36, waist: 30, hips: 38, length: 37 },
    { size: 'XL', bust: 38, waist: 33, hips: 40, length: 38 },
    { size: 'XXL', bust: 40, waist: 36, hips: 44, length: 39 }
  ];

  return (
    <main className="section section-alt">
      <div className="container" style={{ maxWidth: '880px', margin: '0 auto' }}>
        <header className="page-heading">
          <h1 className="section-title">Size & Fit Guide</h1>
          <p className="section-subtitle">Find your exact fit for ultimate styling confidence.</p>
        </header>

        {/* Unit Selector Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '999px', overflow: 'hidden', background: '#fff' }}>
            <button
              onClick={() => setUnit('inches')}
              style={{
                border: 0,
                padding: '0.5rem 1.5rem',
                cursor: 'pointer',
                fontWeight: 700,
                background: unit === 'inches' ? 'var(--accent)' : 'transparent',
                color: unit === 'inches' ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              style={{
                border: 0,
                padding: '0.5rem 1.5rem',
                cursor: 'pointer',
                fontWeight: 700,
                background: unit === 'cm' ? 'var(--accent)' : 'transparent',
                color: unit === 'cm' ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              CENTIMETERS (CM)
            </button>
          </div>
        </div>

        {/* Men's Chart */}
        <article className="content-block" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            Men's Garment Sizing
          </h3>
          <TableContainer component={Paper} elevation={0} style={{ border: '1px solid var(--border)', borderRadius: '12px', background: '#fff' }}>
            <Table>
              <TableHead style={{ background: 'var(--bg-muted)' }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 800 }}>Size</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Chest Size</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Waist Size</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Shoulder Width</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Garment Length</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menSizes.map((row) => (
                  <TableRow key={row.size}>
                    <TableCell style={{ fontWeight: 700 }}>{row.size}</TableCell>
                    <TableCell>{convertVal(row.chest, unit)} {unit === 'inches' ? '"' : 'cm'}</TableCell>
                    <TableCell>{convertVal(row.waist, unit)} {unit === 'inches' ? '"' : 'cm'}</TableCell>
                    <TableCell>{convertVal(row.shoulder, unit)} {unit === 'inches' ? '"' : 'cm'}</TableCell>
                    <TableCell>{convertVal(row.length, unit)} {unit === 'inches' ? '"' : 'cm'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </article>

        {/* Women's Chart */}
        <article className="content-block" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            Women's Garment Sizing
          </h3>
          <TableContainer component={Paper} elevation={0} style={{ border: '1px solid var(--border)', borderRadius: '12px', background: '#fff' }}>
            <Table>
              <TableHead style={{ background: 'var(--bg-muted)' }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 800 }}>Size</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Bust Size</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Waist Size</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Hips Size</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Dress Length</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {womenSizes.map((row) => (
                  <TableRow key={row.size}>
                    <TableCell style={{ fontWeight: 700 }}>{row.size}</TableCell>
                    <TableCell>{convertVal(row.bust, unit)} {unit === 'inches' ? '"' : 'cm'}</TableCell>
                    <TableCell>{convertVal(row.waist, unit)} {unit === 'inches' ? '"' : 'cm'}</TableCell>
                    <TableCell>{convertVal(row.hips, unit)} {unit === 'inches' ? '"' : 'cm'}</TableCell>
                    <TableCell>{convertVal(row.length, unit)} {unit === 'inches' ? '"' : 'cm'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </article>

        {/* Tips & Fit Info */}
        <section className="content-block" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Fit Guidelines & Measurement Tips</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem', color: 'var(--black)' }}>How to Measure</h4>
              <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                <li><strong>Chest / Bust:</strong> Wrap the measuring tape around the fullest part of your chest, keeping the tape level.</li>
                <li><strong>Waist:</strong> Measure around your natural waistline, typically the narrowest point of your torso.</li>
                <li><strong>Hips:</strong> Stand with feet together and measure around the widest part of your hips.</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.5rem', color: 'var(--black)' }}>Garment Fits</h4>
              <p style={{ margin: 0 }}>
                Our styles are designed with everyday wearability and draping comfort in mind. If you find yourself in-between sizes, we recommend sizing up for a relaxed contemporary aesthetic or sizing down for a fitted silhouette.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SizeGuide;
