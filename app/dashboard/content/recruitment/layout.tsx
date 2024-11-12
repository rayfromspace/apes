import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recruitment - Colab Apes",
  description: "Post co-founder and job opportunities for your project",
}

interface RecruitmentLayoutProps {
  children: React.ReactNode
}

export default function RecruitmentLayout({ children }: RecruitmentLayoutProps) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {children}
    </div>
  )
}