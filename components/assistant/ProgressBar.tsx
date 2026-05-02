'use client'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  pathTitle: string
}

export default function ProgressBar({ 
  currentStep, totalSteps, pathTitle 
}: ProgressBarProps) {
  const percent = totalSteps > 0 
    ? Math.round((currentStep / totalSteps) * 100) 
    : 0

  return (
    <div style={{
      padding: '12px 24px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <span style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '200px'
      }}>
        {pathTitle}
      </span>
      <div style={{
        flex: 1,
        height: '4px',
        background: 'var(--border)',
        borderRadius: '100px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${percent}%`,
          background: 'var(--accent)',
          borderRadius: '100px',
          transition: 'width 0.5s ease'
        }} />
      </div>
      <span style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap'
      }}>
        {currentStep}/{totalSteps}
      </span>
    </div>
  )
}
