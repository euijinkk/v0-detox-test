"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, Link, Crown, Heart, ThumbsUp, CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GroupMember {
  id: string
  name: string
  avatar: string
  todayStatus: "achieved" | "failed" | "pending"
  streak: number
}

interface Group {
  id: string
  name: string
  duration: number
  startDate: string
  members: GroupMember[]
  myRole: "admin" | "member"
}

interface GroupManagementProps {
  groups: Group[]
  setGroups: (groups: Group[]) => void
}

export default function GroupManagement({ groups, setGroups }: GroupManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [newGroup, setNewGroup] = useState({
    name: "",
    duration: 7,
  })
  const [joinCode, setJoinCode] = useState("")
  const { toast } = useToast()

  const handleCreateGroup = () => {
    if (!newGroup.name) return

    const group: Group = {
      id: Date.now().toString(),
      name: newGroup.name,
      duration: newGroup.duration,
      startDate: new Date().toISOString().split("T")[0],
      myRole: "admin",
      members: [{ id: "me", name: "나", avatar: "", todayStatus: "pending", streak: 0 }],
    }

    setGroups([...groups, group])
    setNewGroup({ name: "", duration: 7 })
    setShowCreateForm(false)

    toast({
      title: "그룹이 생성되었습니다!",
      description: "친구들을 초대해보세요.",
    })
  }

  const handleJoinGroup = () => {
    if (!joinCode) return

    toast({
      title: "그룹에 참여했습니다!",
      description: "새로운 디톡스 여정을 시작해보세요.",
    })
    setJoinCode("")
    setShowJoinForm(false)
  }

  const generateInviteLink = (groupId: string) => {
    const inviteLink = `https://detox-app.com/join/${groupId}`
    navigator.clipboard.writeText(inviteLink)
    toast({
      title: "초대 링크가 복사되었습니다!",
      description: "친구들에게 공유해보세요.",
    })
  }

  const sendReaction = (groupId: string, memberId: string, reaction: "cheer" | "congrats") => {
    toast({
      title: reaction === "cheer" ? "격려를 보냈습니다!" : "축하를 보냈습니다!",
      description: "긍정적인 에너지를 전달했어요.",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "achieved":
        return "달성"
      case "failed":
        return "실패"
      case "pending":
        return "대기"
      default:
        return "미확인"
    }
  }

  // 그룹 생성 폼
  if (showCreateForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">그룹 생성</h2>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">그룹 이름</Label>
              <Input
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                placeholder="그룹 이름을 입력하세요"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">챌린지 기간</Label>
              <Select
                value={newGroup.duration.toString()}
                onValueChange={(value) => setNewGroup({ ...newGroup, duration: Number.parseInt(value) })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">1주일</SelectItem>
                  <SelectItem value="14">2주일</SelectItem>
                  <SelectItem value="21">3주일</SelectItem>
                  <SelectItem value="28">4주일</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCreateGroup} className="w-full h-12 mt-6">
              그룹 생성
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 그룹 참여 폼
  if (showJoinForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => setShowJoinForm(false)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">그룹 참여</h2>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">초대 코드</Label>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="초대 코드를 입력하세요"
                className="h-12"
              />
            </div>

            <Button onClick={handleJoinGroup} className="w-full h-12 mt-6">
              그룹 참여
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 그룹 상세 보기
  if (selectedGroup) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => setSelectedGroup(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{selectedGroup.name}</h2>
            <p className="text-sm text-gray-600">{selectedGroup.duration}일 챌린지</p>
          </div>
          {selectedGroup.myRole === "admin" && (
            <Button variant="outline" size="sm" onClick={() => generateInviteLink(selectedGroup.id)}>
              <Link className="h-4 w-4 mr-1" />
              초대
            </Button>
          )}
        </div>

        {/* 그룹 통계 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">
              {selectedGroup.members.filter((m) => m.todayStatus === "achieved").length}
            </div>
            <div className="text-sm text-green-700">목표 달성</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <div className="text-2xl font-bold text-red-600">
              {selectedGroup.members.filter((m) => m.todayStatus === "failed").length}
            </div>
            <div className="text-sm text-red-700">목표 실패</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600">
              {selectedGroup.members.filter((m) => m.todayStatus === "pending").length}
            </div>
            <div className="text-sm text-yellow-700">검증 대기</div>
          </div>
        </div>

        {/* 멤버 목록 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">멤버 ({selectedGroup.members.length}명)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {selectedGroup.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        {selectedGroup.myRole === "admin" && member.id !== "me" && (
                          <Crown className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {getStatusIcon(member.todayStatus)}
                        <span>{getStatusText(member.todayStatus)}</span>
                        <span>• {member.streak}일 연속</span>
                      </div>
                    </div>
                  </div>
                  {member.id !== "me" && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => sendReaction(selectedGroup.id, member.id, "cheer")}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => sendReaction(selectedGroup.id, member.id, "congrats")}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 메인 그룹 목록
  return (
    <div className="space-y-4">
      {/* 그룹 생성/참여 버튼 */}
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => setShowCreateForm(true)} className="h-12">
          <Plus className="h-5 w-5 mr-2" />
          그룹 생성
        </Button>
        <Button variant="outline" onClick={() => setShowJoinForm(true)} className="h-12">
          <Users className="h-5 w-5 mr-2" />
          그룹 참여
        </Button>
      </div>

      {/* 그룹 목록 */}
      {groups.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">참여한 그룹이 없습니다</h3>
            <p className="text-gray-600 text-sm mb-4">
              친구들과 함께 디지털 디톡스를
              <br />
              시작해보세요!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedGroup(group)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {group.name}
                        {group.myRole === "admin" && <Crown className="h-4 w-4 text-yellow-500" />}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {group.duration}일 챌린지 • {group.members.length}명
                      </p>
                    </div>
                  </div>
                </div>

                {/* 간단한 통계 */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {group.members.filter((m) => m.todayStatus === "achieved").length}
                    </div>
                    <div className="text-xs text-green-700">달성</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">
                      {group.members.filter((m) => m.todayStatus === "failed").length}
                    </div>
                    <div className="text-xs text-red-700">실패</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">
                      {group.members.filter((m) => m.todayStatus === "pending").length}
                    </div>
                    <div className="text-xs text-yellow-700">대기</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
