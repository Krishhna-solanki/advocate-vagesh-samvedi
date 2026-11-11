import { ImageResponse } from 'next/og';

// Home-screen icon for iPhone/iPad (the browser tab uses icon.svg)
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B0B0B' }}>
        <div
          style={{
            width: 152,
            height: 152,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #C8A45D',
            color: '#C8A45D',
            fontSize: 68,
            fontFamily: 'serif',
          }}
        >
          VS
        </div>
      </div>
    ),
    size,
  );
}
