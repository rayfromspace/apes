import { Metadata } from "next"
import { RecruitmentDashboard } from "@/components/recruitment/recruitment-dashboard"

export const metadata: Metadata = {
  title: "Recruitment - Colab Apes",
  description: "Post co-founder and job opportunities for your project",
}

export default function RecruitmentPage() {
  return <RecruitmentDashboard />
}