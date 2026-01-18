interface BannerProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
}

export function Banner({ message, type = 'error' }: BannerProps) {
  const bgColor = type === 'error' ? '#fef2f2' : type === 'warning' ? '#fffbeb' : '#eff6ff';
  const textColor = type === 'error' ? '#dc2626' : type === 'warning' ? '#d97706' : '#2563eb';
  const borderColor = type === 'error' ? '#fecaca' : type === 'warning' ? '#fde68a' : '#bfdbfe';

  return (
    <div style={{
      padding: '12px 16px',
      backgroundColor: bgColor,
      color: textColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 500,
      marginBottom: '16px',
    }}>
      {message}
    </div>
  );
}
