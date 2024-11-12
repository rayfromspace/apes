import { SettingsTabs } from "@/components/settings/settings-tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="container py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsTabs />
        </CardContent>
      </Card>
    </div>
  )
}