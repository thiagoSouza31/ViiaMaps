import { SignupForm } from "@/components/signup-form"
import { AccessibilityIcon } from "@/components/icons/accessibility-icon"

export default function CadastroPage() {
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
              Junte-se à comunidade ViiaMaps
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Crie sua conta e ajude a construir um mapa mais acessível. 
              Compartilhe suas experiências e ajude outras pessoas a encontrar locais inclusivos.
            </p>
            
            <div className="flex flex-col gap-4 mt-4">
              <FeatureItem 
                icon={<UsersIcon />}
                text="Faça parte de uma comunidade engajada"
              />
              <FeatureItem 
                icon={<HeartIcon />}
                text="Contribua para uma cidade mais inclusiva"
              />
              <FeatureItem 
                icon={<CheckCircleIcon />}
                text="Avalie locais e ajude outros usuários"
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
              Criar sua conta
            </h2>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para começar
            </p>
          </div>

          <SignupForm />
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

function UsersIcon() {
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
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" 
      />
    </svg>
  )
}

function HeartIcon() {
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
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
      />
    </svg>
  )
}

function CheckCircleIcon() {
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
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  )
}
