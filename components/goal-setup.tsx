"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Clock, Smartphone, Timer, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Target from "@/components/ui/target" // Declare the Target variable

interface Goal {
  id: string
  type: "timeSlot" | "specificApp" | "totalTime"
  name: string
  limit: number
  timeSlot?: { start: string; end: string }
  appName?: string
}

interface GoalSetupProps {
  goals: Goal[]
  setGoals: (goals: Goal[]) => void
}

export default function GoalSetup({ goals, setGoals }: GoalSetupProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    type: "totalTime",
    name: "",
    limit: 0,
  })
  const { toast } = useToast()

  const goalTypes = [
    { value: "totalTime", label: "전체 사용시간 제한", icon: Timer },
    { value: "specificApp", label: "특정 앱 시간 제한", icon: Smartphone },
    { value: "timeSlot", label: "시간대별 제한", icon: Clock },
  ]

  const popularApps = [
    "Instagram",
    "TikTok",
    "YouTube",
    "Facebook",
    "Twitter",
    "KakaoTalk",
    "Netflix",
    "Twitch",
    "Discord",
    "Snapchat",
  ]

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.type) return

    const goal: Goal = {
      id: Date.now().toString(),
      type: newGoal.type as Goal["type"],
      name: newGoal.name,
      limit: newGoal.limit || 0,
      ...(newGoal.type === "timeSlot" && { timeSlot: newGoal.timeSlot }),
      ...(newGoal.type === "specificApp" && { appName: newGoal.appName }),
    }

    setGoals([...goals, goal])
    setNewGoal({ type: "totalTime", name: "", limit: 0 })
    setShowAddForm(false)

    toast({
      title: "목표가 추가되었습니다!",
      description: "새로운 목표로 디지털 디톡스를 시작해보세요.",
    })
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id))
    toast({
      title: "목표가 삭제되었습니다",
      description: "목표 목록에서 제거되었습니다.",
    })
  }

  const getGoalIcon = (type: string) => {
    const goalType = goalTypes.find((t) => t.value === type)
    const Icon = goalType?.icon || Timer
    return <Icon className="h-5 w-5" />
  }

  const getGoalDescription = (goal: Goal) => {
    switch (goal.type) {
      case "totalTime":
        return `하루 최대 ${goal.limit}분`
      case "specificApp":
        return `${goal.appName} 최대 ${goal.limit}분`
      case "timeSlot":
        return `${goal.timeSlot?.start} - ${goal.timeSlot?.end} 사용 금지`
      default:
        return ""
    }
  }

  if (showAddForm) {
    return (
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">새 목표 추가</h2>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-4">
            {/* 목표 유형 선택 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">목표 유형</Label>
              <Select
                value={newGoal.type}
                onValueChange={(value) => setNewGoal({ ...newGoal, type: value as Goal["type"] })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="목표 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {goalTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 목표 이름 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">목표 이름</Label>
              <Input
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="목표 이름을 입력하세요"
                className="h-12"
              />
            </div>

            {/* 앱 선택 (특정 앱 제한인 경우) */}
            {newGoal.type === "specificApp" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">앱 선택</Label>
                <Select value={newGoal.appName} onValueChange={(value) => setNewGoal({ ...newGoal, appName: value })}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="앱을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularApps.map((app) => (
                      <SelectItem key={app} value={app}>
                        {app}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 시간 제한 */}
            {(newGoal.type === "totalTime" || newGoal.type === "specificApp") && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">시간 제한 (분)</Label>
                <Input
                  type="number"
                  value={newGoal.limit}
                  onChange={(e) => setNewGoal({ ...newGoal, limit: Number.parseInt(e.target.value) || 0 })}
                  placeholder="분 단위로 입력"
                  className="h-12"
                />
              </div>
            )}

            {/* 시간대 설정 */}
            {newGoal.type === "timeSlot" && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">금지 시간대</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">시작 시간</Label>
                    <Input
                      type="time"
                      value={newGoal.timeSlot?.start || ""}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          timeSlot: {
                            ...newGoal.timeSlot,
                            start: e.target.value,
                            end: newGoal.timeSlot?.end || "",
                          },
                        })
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">종료 시간</Label>
                    <Input
                      type="time"
                      value={newGoal.timeSlot?.end || ""}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          timeSlot: {
                            ...newGoal.timeSlot,
                            start: newGoal.timeSlot?.start || "",
                            end: e.target.value,
                          },
                        })
                      }
                      className="h-12"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleAddGoal} className="w-full h-12 mt-6">
              목표 추가
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 목표 추가 버튼 */}
      <Button onClick={() => setShowAddForm(true)} className="w-full h-12">
        <Plus className="h-5 w-5 mr-2" />새 목표 추가
      </Button>

      {/* 목표 목록 */}
      {goals.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-12">
            <Target className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">목표를 설정해보세요</h3>
            <p className="text-gray-600 text-sm mb-4">
              건강한 디지털 라이프를 위한
              <br />첫 번째 목표를 만들어보세요
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <Card key={goal.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-indigo-50 rounded-lg mt-1">{getGoalIcon(goal.type)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">{goal.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{getGoalDescription(goal)}</p>
                      <Badge variant="outline" className="text-xs">
                        {goalTypes.find((t) => t.value === goal.type)?.label}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 스크린타임 권한 안내 */}
      <Card className="border-0 shadow-sm bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">스크린타임 권한</h3>
              <p className="text-sm text-blue-800 mb-3">정확한 목표 달성 확인을 위해 스크린타임 권한이 필요합니다.</p>
              <Button variant="outline" size="sm" className="bg-white border-blue-200 text-blue-700">
                권한 설정하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
