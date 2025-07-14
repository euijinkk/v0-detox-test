"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Upload, Camera, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Goal {
  id: string
  type: "timeSlot" | "specificApp" | "totalTime"
  name: string
  limit: number
  timeSlot?: { start: string; end: string }
  appName?: string
}

interface TodayProgress {
  totalScreenTime: number
  goalAchieved: boolean
  lastUpdated: Date | null
}

interface DailyVerificationProps {
  goals: Goal[]
  todayProgress: TodayProgress
  setTodayProgress: (progress: TodayProgress) => void
}

interface AppUsage {
  name: string
  time: number
}

export default function DailyVerification({ goals, todayProgress, setTodayProgress }: DailyVerificationProps) {
  const [screenTimeData, setScreenTimeData] = useState({
    totalTime: 0,
    appUsages: [] as AppUsage[],
  })
  const [isUploading, setIsUploading] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)
  const { toast } = useToast()

  const handleManualInput = () => {
    const newProgress = {
      totalScreenTime: screenTimeData.totalTime,
      goalAchieved: checkGoalsAchieved(),
      lastUpdated: new Date(),
    }

    setTodayProgress(newProgress)

    toast({
      title: "스크린타임 데이터가 업데이트되었습니다!",
      description: newProgress.goalAchieved
        ? "축하합니다! 오늘 목표를 달성했어요."
        : "아쉽지만 목표를 달성하지 못했어요. 내일 다시 도전해보세요!",
    })
  }

  const handleScreenshotUpload = () => {
    setIsUploading(true)

    setTimeout(() => {
      const mockData = {
        totalTime: 180,
        appUsages: [
          { name: "Instagram", time: 45 },
          { name: "YouTube", time: 60 },
          { name: "KakaoTalk", time: 30 },
          { name: "Safari", time: 45 },
        ],
      }

      setScreenTimeData(mockData)
      setIsUploading(false)

      const newProgress = {
        totalScreenTime: mockData.totalTime,
        goalAchieved: checkGoalsAchieved(mockData),
        lastUpdated: new Date(),
      }

      setTodayProgress(newProgress)

      toast({
        title: "스크린샷 분석이 완료되었습니다!",
        description: "스크린타임 데이터가 자동으로 업데이트되었어요.",
      })
    }, 2000)
  }

  const checkGoalsAchieved = (data = screenTimeData) => {
    return goals.every((goal) => {
      switch (goal.type) {
        case "totalTime":
          return data.totalTime <= goal.limit
        case "specificApp":
          const appUsage = data.appUsages.find((app) => app.name === goal.appName)
          return !appUsage || appUsage.time <= goal.limit
        case "timeSlot":
          return true
        default:
          return true
      }
    })
  }

  const getGoalStatus = (goal: Goal) => {
    if (!todayProgress.lastUpdated) return "pending"

    switch (goal.type) {
      case "totalTime":
        return screenTimeData.totalTime <= goal.limit ? "achieved" : "failed"
      case "specificApp":
        const appUsage = screenTimeData.appUsages.find((app) => app.name === goal.appName)
        if (!appUsage) return "achieved"
        return appUsage.time <= goal.limit ? "achieved" : "failed"
      case "timeSlot":
        return "achieved"
      default:
        return "pending"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "failed":
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-4">
      {/* 오늘의 상태 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            {todayProgress.lastUpdated ? (
              todayProgress.goalAchieved ? (
                <>
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <div className="flex-1">
                    <p className="font-bold text-green-700 text-lg">목표 달성!</p>
                    <p className="text-sm text-green-600">오늘 하루 수고하셨어요</p>
                    <p className="text-xs text-gray-500 mt-1">{todayProgress.lastUpdated.toLocaleString()}</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-12 w-12 text-red-500" />
                  <div className="flex-1">
                    <p className="font-bold text-red-700 text-lg">목표 미달성</p>
                    <p className="text-sm text-red-600">내일은 더 잘할 수 있어요</p>
                    <p className="text-xs text-gray-500 mt-1">{todayProgress.lastUpdated.toLocaleString()}</p>
                  </div>
                </>
              )
            ) : (
              <>
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
                <div className="flex-1">
                  <p className="font-bold text-yellow-700 text-lg">검증 필요</p>
                  <p className="text-sm text-yellow-600">스크린타임을 공유해주세요</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 스크린타임 데이터 입력 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">스크린타임 공유</CardTitle>
          <CardDescription className="text-sm">
            오늘의 스크린타임 데이터를 공유하여 목표 달성 여부를 확인하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          {/* 스크린샷 업로드 */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <Camera className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-600 mb-4">
              스크린타임 설정 화면의 스크린샷을 업로드하면
              <br />
              자동으로 데이터를 분석해드립니다.
            </p>
            <Button onClick={handleScreenshotUpload} disabled={isUploading} className="w-full h-12 mb-3">
              {isUploading ? (
                <>
                  <Upload className="h-5 w-5 mr-2 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  스크린샷 업로드
                </>
              )}
            </Button>

            <Button variant="outline" onClick={() => setShowManualInput(!showManualInput)} className="w-full h-12">
              수동으로 입력하기
            </Button>
          </div>

          {/* 수동 입력 폼 */}
          {showManualInput && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
              <div className="space-y-2">
                <Label className="text-sm font-medium">총 스크린타임 (분)</Label>
                <Input
                  type="number"
                  value={screenTimeData.totalTime}
                  onChange={(e) =>
                    setScreenTimeData({
                      ...screenTimeData,
                      totalTime: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="오늘 총 사용시간을 분 단위로 입력"
                  className="h-12"
                />
              </div>

              {goals
                .filter((g) => g.type === "specificApp")
                .map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <Label className="text-sm font-medium">{goal.appName} 사용시간 (분)</Label>
                    <Input
                      type="number"
                      value={screenTimeData.appUsages.find((app) => app.name === goal.appName)?.time || 0}
                      onChange={(e) => {
                        const time = Number.parseInt(e.target.value) || 0
                        const newAppUsages = screenTimeData.appUsages.filter((app) => app.name !== goal.appName)
                        if (time > 0) {
                          newAppUsages.push({ name: goal.appName!, time })
                        }
                        setScreenTimeData({
                          ...screenTimeData,
                          appUsages: newAppUsages,
                        })
                      }}
                      placeholder={`${goal.appName} 사용시간을 분 단위로 입력`}
                      className="h-12"
                    />
                  </div>
                ))}

              <Button onClick={handleManualInput} className="w-full h-12">
                데이터 업데이트
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 목표별 달성 현황 */}
      {goals.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">목표별 달성 현황</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {goals.map((goal) => {
                const status = getGoalStatus(goal)
                const isAchieved = status === "achieved"

                return (
                  <div key={goal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(status)}
                      <div className="flex-1">
                        <p className="font-medium">{goal.name}</p>
                        <p className="text-sm text-gray-600">
                          {goal.type === "totalTime" && `목표: ${goal.limit}분 이하`}
                          {goal.type === "specificApp" && `${goal.appName}: ${goal.limit}분 이하`}
                          {goal.type === "timeSlot" && `${goal.timeSlot?.start} - ${goal.timeSlot?.end} 사용 금지`}
                        </p>
                        {todayProgress.lastUpdated && (
                          <p className="text-xs text-gray-500 mt-1">
                            {goal.type === "totalTime" && `실제: ${screenTimeData.totalTime}분`}
                            {goal.type === "specificApp" &&
                              `실제: ${screenTimeData.appUsages.find((app) => app.name === goal.appName)?.time || 0}분`}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={isAchieved ? "default" : status === "failed" ? "destructive" : "secondary"}
                      className="ml-2"
                    >
                      {status === "achieved" ? "달성" : status === "failed" ? "실패" : "대기"}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
