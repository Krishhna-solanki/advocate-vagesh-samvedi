import { ImageResponse } from 'next/og';

export const alt = 'Advocate Vagesh Samvedi — Advocate & Legal Consultant';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          background: '#0B0B0B',
          color: '#F5F1E8',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 88, height: 88, border: '2px solid #C8A45D', color: '#C8A45D', fontSize: 38 }}>
          VS
        </div>
        <div style={{ marginTop: 56, fontSize: 22, letterSpacing: 6, color: '#C8A45D', textTransform: 'uppercase' }}>
          Advocate &amp; Legal Consultant
        </div>
        <div style={{ marginTop: 20, fontSize: 84, lineHeight: 1.05 }}>Vagesh Samvedi</div>
        <div style={{ marginTop: 36, width: 120, height: 2, background: '#C8A45D' }} />
        <div style={{ marginTop: 36, fontSize: 30, color: '#AAA6A0' }}>Clarity in Law. Confidence in Every Decision.</div>
      </div>
    ),
    size,
  );
}
