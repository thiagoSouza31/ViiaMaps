import { AccessibilityFeatures } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface AccessibilityBadgesProps {
  accessibility: AccessibilityFeatures
  showAll?: boolean
}

const accessibilityLabels: Record<keyof AccessibilityFeatures, { label: string; icon: React.ReactNode }> = {
  wheelchairRamp: {
    label: "Rampa de Acesso",
    icon: <WheelchairIcon className="size-3" />,
  },
  adaptedBathroom: {
    label: "Banheiro Adaptado",
    icon: <BathroomIcon className="size-3" />,
  },
  elevator: {
    label: "Elevador",
    icon: <ElevatorIcon className="size-3" />,
  },
  tactilePaving: {
    label: "Piso Tátil",
    icon: <TactileIcon className="size-3" />,
  },
  preferentialParking: {
    label: "Vaga Preferencial",
    icon: <ParkingIcon className="size-3" />,
  },
  signLanguage: {
    label: "Libras",
    icon: <SignLanguageIcon className="size-3" />,
  },
  brailleSignage: {
    label: "Sinalização em Braille",
    icon: <BrailleIcon className="size-3" />,
  },
}

export function AccessibilityBadges({ accessibility, showAll = false }: AccessibilityBadgesProps) {
  const features = Object.entries(accessibility) as [keyof AccessibilityFeatures, boolean][]
  
  const availableFeatures = features.filter(([, value]) => value)
  const unavailableFeatures = features.filter(([, value]) => !value)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {availableFeatures.map(([key]) => (
          <Badge
            key={key}
            variant="default"
            className="bg-accent text-accent-foreground gap-1.5 py-1"
          >
            {accessibilityLabels[key].icon}
            {accessibilityLabels[key].label}
          </Badge>
        ))}
      </div>
      
      {showAll && unavailableFeatures.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unavailableFeatures.map(([key]) => (
            <Badge
              key={key}
              variant="outline"
              className="text-muted-foreground gap-1.5 py-1"
            >
              {accessibilityLabels[key].icon}
              {accessibilityLabels[key].label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function WheelchairIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="4" r="2" fill="currentColor" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h3v5l4 6M7 13h5" />
    </svg>
  )
}

function BathroomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m8 0h1M7 20h1m8 0h1M5 10V5a2 2 0 012-2h10a2 2 0 012 2v5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10" />
    </svg>
  )
}

function ElevatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M8 8l2-2 2 2M14 16l2 2 2-2" />
    </svg>
  )
}

function TactileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="6" cy="6" r="2" fill="currentColor" />
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <circle cx="18" cy="6" r="2" fill="currentColor" />
      <circle cx="6" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="18" cy="12" r="2" fill="currentColor" />
      <circle cx="6" cy="18" r="2" fill="currentColor" />
      <circle cx="12" cy="18" r="2" fill="currentColor" />
      <circle cx="18" cy="18" r="2" fill="currentColor" />
    </svg>
  )
}

function ParkingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7h4a3 3 0 010 6H9" />
    </svg>
  )
}

function SignLanguageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    </svg>
  )
}

function BrailleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      <circle cx="6" cy="12" r="1.5" fill="currentColor" />
      <circle cx="6" cy="18" r="1.5" fill="currentColor" />
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" />
      <circle cx="18" cy="18" r="1.5" fill="currentColor" />
    </svg>
  )
}
