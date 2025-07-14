"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Users,
  Target,
  Calendar,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import GoalSetup from "@/components/goal-setup";
import GroupManagement from "@/components/group-management";
import DailyVerification from "@/components/daily-verification";
import BottomNavigation from "@/components/bottom-navigation";

interface Goal {
  id: string;
  type: "timeSlot" | "specificApp" | "totalTime";
  name: string;
  limit: number;
  timeSlot?: { start: string; end: string };
  appName?: string;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  todayStatus: "achieved" | "failed" | "pending";
  streak: number;
}

interface Group {
  id: string;
  name: string;
  duration: number;
  startDate: string;
  members: GroupMember[];
  myRole: "admin" | "member";
}

export default function DigitalDetoxMobileApp() {
  const [currentTab, setCurrentTab] = useState("home");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [todayProgress, setTodayProgress] = useState({
    totalScreenTime: 0,
    goalAchieved: false,
    lastUpdated: null as Date | null,
  });

  // 샘플 데이터 초기화
  useEffect(() => {
    const sampleGoals: Goal[] = [
      {
        id: "1",
        type: "totalTime",
        name: "하루 총 사용시간",
        limit: 180,
      },
      {
        id: "2",
        type: "specificApp",
        name: "인스타그램",
        limit: 30,
        appName: "Instagram",
      },
      {
        id: "3",
        type: "timeSlot",
        name: "수면 시간대",
        limit: 0,
        timeSlot: { start: "22:00", end: "07:00" },
      },
    ];

    const sampleGroups: Group[] = [
      {
        id: "1",
        name: "디지털 디톡스 챌린지",
        duration: 14,
        startDate: "2024-01-01",
        myRole: "admin",
        members: [
          {
            id: "1",
            name: "김철수",
            avatar: "",
            todayStatus: "achieved",
            streak: 5,
          },
          {
            id: "2",
            name: "이영희",
            avatar: "",
            todayStatus: "failed",
            streak: 2,
          },
          {
            id: "3",
            name: "박민수",
            avatar: "",
            todayStatus: "pending",
            streak: 4,
          },
          {
            id: "4",
            name: "나",
            avatar: "",
            todayStatus: "pending",
            streak: 3,
          },
        ],
      },
    ];

    setGoals(sampleGoals);
    setGroups(sampleGroups);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "achieved":
        return "달성";
      case "failed":
        return "실패";
      case "pending":
        return "대기";
      default:
        return "미확인";
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case "home":
        return (
          <HomeScreen
            goals={goals}
            groups={groups}
            todayProgress={todayProgress}
            getStatusIcon={getStatusIcon}
            getStatusText={getStatusText}
          />
        );
      case "goals":
        return <GoalSetup goals={goals} setGoals={setGoals} />;
      case "groups":
        return <GroupManagement groups={groups} setGroups={setGroups} />;
      case "verification":
        return (
          <DailyVerification
            goals={goals}
            todayProgress={todayProgress}
            setTodayProgress={setTodayProgress}
          />
        );
      default:
        return (
          <HomeScreen
            goals={goals}
            groups={groups}
            todayProgress={todayProgress}
            getStatusIcon={getStatusIcon}
            getStatusText={getStatusText}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 상태바 영역 */}
      <div className="h-12 bg-white"></div>

      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">디지털 디톡스</h1>
              <p className="text-sm text-gray-600">건강한 라이프</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-4 py-4">{renderContent()}</div>

      {/* 하단 네비게이션 */}
      <BottomNavigation currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}

// 홈 스크린 컴포넌트
function HomeScreen({
  goals,
  groups,
  todayProgress,
  getStatusIcon,
  getStatusText,
}: any) {
  return (
    <div className="space-y-4">
      {/* 오늘의 상태 카드 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">오늘의 목표</h2>
            <Badge
              variant={todayProgress.goalAchieved ? "default" : "secondary"}
            >
              {todayProgress.lastUpdated
                ? todayProgress.goalAchieved
                  ? "달성"
                  : "미달성"
                : "검증 필요"}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">전체 진행률</span>
              <span className="text-gray-600">
                {goals.length > 0
                  ? Math.round(
                      (goals.filter((g: any) => todayProgress.goalAchieved)
                        .length /
                        goals.length) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
            <Progress
              value={
                goals.length > 0
                  ? (goals.filter((g: any) => todayProgress.goalAchieved)
                      .length /
                      goals.length) *
                    100
                  : 0
              }
              className="h-2"
            />
          </div>

          {todayProgress.lastUpdated && (
            <p className="text-xs text-gray-500 mt-3">
              마지막 업데이트: {todayProgress.lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 목표 목록 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">나의 목표</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">설정된 목표가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal: any) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon("pending")}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{goal.name}</p>
                      <p className="text-xs text-gray-600">
                        {goal.type === "totalTime" && `목표: ${goal.limit}분`}
                        {goal.type === "specificApp" &&
                          `${goal.appName}: ${goal.limit}분`}
                        {goal.type === "timeSlot" &&
                          `${goal.timeSlot?.start} - ${goal.timeSlot?.end}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    검증 필요
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 그룹 현황 */}
      {groups.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">그룹 현황</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {groups.map((group: any) => (
              <div key={group.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">{group.name}</h3>
                  <Badge className="text-xs">{group.duration}일</Badge>
                </div>

                {/* 그룹 통계 */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {
                        group.members.filter(
                          (m: any) => m.todayStatus === "achieved"
                        ).length
                      }
                    </div>
                    <div className="text-xs text-green-700">달성</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">
                      {
                        group.members.filter(
                          (m: any) => m.todayStatus === "failed"
                        ).length
                      }
                    </div>
                    <div className="text-xs text-red-700">실패</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">
                      {
                        group.members.filter(
                          (m: any) => m.todayStatus === "pending"
                        ).length
                      }
                    </div>
                    <div className="text-xs text-yellow-700">대기</div>
                  </div>
                </div>

                {/* 멤버 목록 (최대 3명만 표시) */}
                <div className="space-y-2">
                  {group.members.slice(0, 3).map((member: any) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={member.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {member.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-gray-600">
                            {member.streak}일 연속
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(member.todayStatus)}
                        <span className="text-xs">
                          {getStatusText(member.todayStatus)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {group.members.length > 3 && (
                    <p className="text-xs text-gray-500 text-center py-2">
                      +{group.members.length - 3}명 더
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 빠른 액션 버튼들 */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button
          className="h-14 flex-col gap-1 bg-transparent"
          variant="outline"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-sm">오늘 검증</span>
        </Button>
        <Button
          className="h-14 flex-col gap-1 bg-transparent"
          variant="outline"
        >
          <Users className="h-5 w-5" />
          <span className="text-sm">그룹 보기</span>
        </Button>
      </div>
    </div>
  );
}
