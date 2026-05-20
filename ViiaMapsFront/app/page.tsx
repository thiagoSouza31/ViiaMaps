import { LoginForm } from "@/components/login-form"
import { AccessibilityIcon } from "@/components/icons/accessibility-icon"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex">
      {/* Lado esquerdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <AccessibilityIcon className="size-10" />
            <span className="text-2xl font-bold">ViiaMaps</span>
          </div>
          
          <div className="flex flex-col gap-6 max-w-md">
            <h1 className="text-4xl font-bold leading-tight text-balance">
              Encontre locais acessíveis na sua cidade
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Avalie e descubra estabelecimentos com rampas de acesso, banheiros adaptados, 
              vagas preferenciais e muito mais. Juntos, construímos uma cidade mais inclusiva.
            </p>
            
            <div className="flex flex-col gap-4 mt-4">
              <FeatureItem 
                icon={<WheelchairIcon />}
                text="Informações de acessibilidade verificadas pela comunidade"
              />
              <FeatureItem 
                icon={<MapPinIcon />}
                text="Busque qualquer endereço ou estabelecimento"
              />
              <FeatureItem 
                icon={<StarIcon />}
                text="Avalie e ajude outros usuários"
              />
            </div>
          </div>
          
          <p className="text-sm text-primary-foreground/60">
            Projeto desenvolvido para promover acessibilidade e inclusão.
          </p>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <AccessibilityIcon className="size-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">ViiaMaps</span>
          </div>

          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Bem-vindo de volta
            </h2>
            <p className="text-muted-foreground">
              Entre com suas credenciais para acessar sua conta
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  )
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 size-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-sm text-primary-foreground/90">{text}</p>
    </div>
  )
}

function WheelchairIcon() {
  return (
    <svg 
      className="size-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 2a2 2 0 100 4 2 2 0 000-4zM10 8v6m0 0l-3 3m3-3h6l2 6m-6-6v3" 
      />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg 
      className="size-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" 
      />
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" 
      />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg 
      className="size-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={1.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
      />
    </svg>
  )
}
